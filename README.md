Öğrenci Adı Soyadı: Süeda Kanlı
Öğrenci No: 241478058
E-posta: 241478058@samsun.edu.tr
GitHub: https://github.com/suedaknl/incident-response-primer
---

# SE Primer — Sızıntı Gecesi

Canlıdaki bir mobil uygulamada tespit edilen kritik veri sızıntısını (KVKK ihlali + siber tehdit) konu alan, Sokratik AI Tutor destekli interaktif karar oyunu. Oyuncu 3 karar verir (Mimari/Müdahale, Test, KVKK/Adli Bilişim) ve İyi Son ya da Kötü Son'a ulaşır.

## Belgeler

| Dosya | İçerik |
|---|---|
| [`spec.md`](./spec.md) | Problem tanımı, kapsam dışı, 5 kabul kriteri, mermaid akış şeması |
| [`system-prompt.md`](./system-prompt.md) | Google AI Studio Sokratik Tutor sistem istemi |
| [`DESIGN.md`](./DESIGN.md) | 3 mobil ekran ve `data-cy` etiketli bileşenler |
| [`spec.cy.js`](./spec.cy.js) | Cypress E2E test şablonu |

## Teknoloji

Google Stitch (UI) · Google AI Studio / Gemini (Logic, Tutor) · Cypress (E2E)

## Çalıştırma

```bash
npm install
cp .env.example .env      # AI Studio API anahtarını ekle (repoya EKLEME)
npm run dev               # uygulama
npx cypress open          # testler (API anahtarı gerekmez, AI yanıtı sabitlenir)
```

## Bilinçli Olarak Yapılmayan Özellikler (Ürün Kararları)

1. **Kullanıcı hesabı yok:** Öğrenme hedefi karar akışıdır ve kişisel veri toplamak oyunun KVKK mesajıyla çelişirdi.
2. **Gerçek tehdit verisi yok:** Tüm log ve kişi verileri sentetiktir; böylece hem gerçek kişi verisi hem de gerçek saldırı bilgisi sızdırma riski sıfırlanır.
3. **Native build yok:** Mobil-öncelikli web arayüzü, tek kod tabanıyla Cypress'te otomatik test edilebilirlik sağlar ve mağaza süreçleri öğrenme hedefine katkı vermez.

## Lisans / Uyarı

Eğitim amaçlı kurgusal senaryodur; gerçek kişi, kurum veya olayla ilgisi yoktur.
