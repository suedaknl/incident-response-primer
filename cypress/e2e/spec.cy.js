/// <reference types="cypress" />

// SE Primer — E2E şablonu
// Varsayımlar: cypress.config.js içinde baseUrl tanımlı; uygulama her karar ve başlangıçta
// (toplam 4 çağrı) Gemini generateContent endpoint'ini çağırır; sonuç mantığı istemcidedir.

const dur = (text) => ({
  candidates: [
    { content: { role: 'model', parts: [{ text }] }, finishReason: 'STOP', index: 0 },
  ],
});

// Sabit Tutor yanıtları: sırayla 1) başlangıç 2) K1 sonrası 3) K2 sonrası 4) K3/sonuç sonrası
const TUTOR_YANITLARI = [
  'Alarm çaldı, loglarda sızıntı izi var. Kriz masasına ilk hangi sorunun cevabını getirirsin? [DURUM: aşama=1; saat=02:10]',
  'Müdahale başladı. Yamanın işe yaradığını nasıl kanıtlarsın? [DURUM: aşama=2; saat=02:35]',
  'Yayın hazır. Loglardaki kullanıcı verisiyle ne yapacaksın ve neden? [DURUM: aşama=3; saat=02:50]',
  'Kriz kapandı. Kararlarından hangisini farklı verirdin, neden? [DURUM: aşama=4; saat=03:10]',
];

// NOT: Gemini URL'leri "models/<model>:generateContent" biçimindedir; ":" öncesinde "/" olmadığı için
// '**/generateContent*' eşleşmeyebilir. Bu yüzden '**/*generateContent*' kullanılır (daha kapsayıcı).
// Streaming kullanılıyorsa ek olarak '**/*streamGenerateContent*' intercept'i ekle.
const stubAI = (yanitlar = TUTOR_YANITLARI) => {
  let i = 0;
  cy.intercept('POST', '**/*generateContent*', (req) => {
    const text = yanitlar[Math.min(i++, yanitlar.length - 1)];
    req.reply({ statusCode: 200, body: dur(text) });
  }).as('tutor');
};

const girisYap = ({
  seviye = 'orta',
  rol = 'devops',
  hedef = 'Staj mülakatına hazırlanmak',
} = {}) => {
  cy.wait(200); // 500'den 200'e çektik
  cy.get('[data-cy=profil-seviye]').select(seviye);
  cy.wait(200);
  cy.get('[data-cy=profil-rol]').select(rol);
  cy.wait(200);
  cy.get('[data-cy=profil-hedef]').type(hedef);
  cy.wait(400); 
  cy.get('[data-cy=baslat-btn]').should('not.be.disabled').click();
  cy.wait('@tutor');
  cy.get('[data-cy=sahne-screen]').should('be.visible');
  cy.wait(600); // 1500'den 600'e çektik
};

const kararVer = (no, secenek) => {
  cy.get('[data-cy=sahne-asama]').should('contain', `${no}/3`);
  cy.wait(400); // 1000'den 400'e çektik
  cy.get(`[data-cy=karar-${secenek}-btn]`).click();
  cy.wait(200);
  cy.get('[data-cy=karar-onayla-btn]').should('not.be.disabled').click();
  cy.wait('@tutor');
  cy.wait(600); // 1500'den 600'e çektik
};

describe('SE Primer — karar ağacı E2E', () => {
  beforeEach(() => {
    cy.viewport(390, 844);
    stubAI();
    cy.visit('/');
  });

  describe('Giriş ekranı', () => {
    it('seviye, rol ve hedef dolmadan Başla pasif kalır (AC-1)', () => {
      cy.get('[data-cy=giris-screen]').should('be.visible');
      cy.get('[data-cy=sentetik-veri-uyarisi]').should('be.visible');
      cy.get('[data-cy=baslat-btn]').should('be.disabled');

      cy.get('[data-cy=profil-seviye]').select('orta');
      cy.get('[data-cy=baslat-btn]').should('be.disabled');
      cy.get('[data-cy=profil-rol]').select('dpo');
      cy.get('[data-cy=baslat-btn]').should('be.disabled');
      cy.get('[data-cy=profil-hedef]').type('Vize hazırlığı');
      cy.get('[data-cy=baslat-btn]').should('not.be.disabled');
    });

    it('başladıktan sonra Tutor yanıtı ve DURUM etiketi görünür (AC-4)', () => {
      girisYap();
      cy.get('[data-cy=tutor-mesaj]').should('contain', 'Alarm çaldı');
      cy.get('[data-cy=durum-etiketi]')
        .should('contain', 'aşama=1')
        .and('contain', 'saat=02:10');
    });
  });

  describe('Karar sahnesi', () => {
    it('seçim yapılmadan onay pasif; 3 karar sırayla sunulur (AC-2)', () => {
      girisYap();
      cy.get('[data-cy=sahne-asama]').should('contain', '1/3');
      cy.get('[data-cy=karar-onayla-btn]').should('be.disabled');
      cy.get('[data-cy=karar-a-btn]').click();
      cy.get('[data-cy=karar-onayla-btn]').should('not.be.disabled');
    });
  });

  describe('Sonuç yolları (AC-3)', () => {
    it('İYİ SON: K1=A, K2=A (test), K3=B (ham log izole)', () => {
      girisYap();
      kararVer(1, 'a');
      kararVer(2, 'a');
      kararVer(3, 'b');

      cy.get('[data-cy=sonuc-screen]').should('be.visible');
      cy.get('[data-cy=sonuc-iyi]').should('be.visible');
      cy.get('[data-cy=sonuc-kotu]').should('not.exist');
      cy.get('[data-cy=karar-gecmisi]').should('be.visible');
      cy.get('[data-cy=debrief-mesaj]').should('not.be.empty');
    });

    it('İYİ SON: K1 seçimi sonucu değiştirmez (K1=B, K2=A, K3=B)', () => {
      girisYap();
      kararVer(1, 'b');
      kararVer(2, 'a');
      kararVer(3, 'b');

      cy.get('[data-cy=sonuc-iyi]').should('be.visible');
      cy.get('[data-cy=sonuc-kotu]').should('not.exist');
    });

    it('KÖTÜ SON (zafiyet sürüyor): K1=B, K2=B (testsiz yayın), K3=B', () => {
      girisYap();
      kararVer(1, 'b');
      kararVer(2, 'b');
      kararVer(3, 'b');

      cy.get('[data-cy=sonuc-kotu]').should('be.visible');
      cy.get('[data-cy=sonuc-iyi]').should('not.exist');
      cy.get('[data-cy=sonuc-nedenler]')
        .should('contain', 'Zafiyet sürüyor')
        .and('not.contain', 'Deliller karartıldı');
    });

    it('KÖTÜ SON (deliller karartıldı): K1=A, K2=A, K3=A (anında maskele)', () => {
      girisYap();
      kararVer(1, 'a');
      kararVer(2, 'a');
      kararVer(3, 'a');

      cy.get('[data-cy=sonuc-kotu]').should('be.visible');
      cy.get('[data-cy=sonuc-nedenler]')
        .should('contain', 'Deliller karartıldı')
        .and('not.contain', 'Zafiyet sürüyor');
    });

    it('KÖTÜ SON (ikisi birden): K2=B ve K3=A', () => {
      girisYap();
      kararVer(1, 'a');
      kararVer(2, 'b');
      kararVer(3, 'a');

      cy.get('[data-cy=sonuc-kotu]').should('be.visible');
      cy.get('[data-cy=sonuc-nedenler]')
        .should('contain', 'Zafiyet sürüyor')
        .and('contain', 'Deliller karartıldı');
    });
  });

  describe('Yeniden oynama', () => {
    it('Tekrar oyna Giriş ekranına döner ve durumu sıfırlar', () => {
      girisYap();
      kararVer(1, 'a');
      kararVer(2, 'a');
      kararVer(3, 'b');

      cy.get('[data-cy=tekrar-oyna-btn]').click();
      cy.get('[data-cy=giris-screen]').should('be.visible');
      cy.get('[data-cy=baslat-btn]').should('be.disabled');
    });
  });
});

describe("Diferansiyel test: Python (ONNX) vs tarayıcı (onnxruntime-web)", () => {
  const TOLERANS = 1e-4;

  it("5 referans girdide |p_js - p_python| < 1e-4", () => {
    cy.readFile("tests/parite.json").then((vakalar) => {
      expect(vakalar).to.have.length.greaterThan(0);

      cy.visit("/"); // baseUrl'ine göre oyun sayfasının yolunu ayarla

      vakalar.forEach((vaka, i) => {
        // Model ilk seferde indirilebilir, bu yüzden uzun timeout
        cy.window().then({ timeout: 60000 }, (win) =>
          win.ipucuOlasiligiHesapla(vaka.girdi)
        );

        cy.get('[data-cy="p"]')
          .invoke("text")
          .then((metin) => {
            const pJs = parseFloat(metin);
            expect(pJs, `vaka ${i} sayısal mı`).to.not.be.NaN;
            const fark = Math.abs(pJs - vaka.p1);
            expect(
              fark,
              `vaka ${i}: JS=${pJs}, Python=${vaka.p1}, fark=${fark}`
            ).to.be.lessThan(TOLERANS);
          });
      });
    });
  });
});
