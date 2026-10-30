**Öğrenci Adı Soyadı:** Süeda Kanlı
**Öğrenci No:** 241478058
**E-posta:** 241478058@samsun.edu.tr
**GitHub:** https://github.com/suedaknl/incident-response-primer
---

# SE Primer — Sızıntı Gecesi

Canlıdaki bir mobil uygulamada tespit edilen kritik veri sızıntısını (KVKK ihlali + siber tehdit) konu alan interaktif karar oyunu. v2.0 güncellemesiyle birlikte, statik Sokratik AI Tutor yapısına oyuncunun davranışlarından (karar süresi, hata geçmişi, zorluk seviyesi) öğrenen ve tarayıcıda çalışan (ONNX) küçük bir Makine Öğrenmesi modeli entegre edilmiştir.

## Belgeler

| Dosya | İçerik |
|---|---|
| [`spec.md`]| Problem tanımı, kapsam dışı, 5 temel kabul kriteri ve v2.0 ML eşik/kabul örnekleri. |
| [`data/oturumlar.csv`]| PModel eğitimi için toplanan gerçek insan oturum verileri ve veri sözlüğü (SOZLUK.md).|
| [`train.py`] | Tekrarlanabilir (reproducible) model eğitim betiği ve eval kapısı. |
| [`model/`]| Üretilen model.onnx artefaktı, config.json sözleşmesi ve Model Kartı (README.md). |
| [`tests/parite.py`]| Python tabanlı Oracle test kahini (Cypress diferansiyel testi için referans veri üretir). |
| [`RELEASE.md`]| v2.0 mimari ödünleşim (trade-off) matrisi, gölge dağıtım (shadow) ve rollback planı.|
| [`SINAV_TASARIMI.md`] | v2.0 mimari ödünleşim (trade-off) matrisi, gölge dağıtım (shadow) ve rollback planı.|
| [`system-prompt.md`] | Google AI Studio Sokratik Tutor sistem istemi. |
| [`spec.cy.js`] | E2E regresyon testleri ve ML Diferansiyel Parite Testi  |

## Teknoloji

Arayüz & Mantık: HTML/JS/CSS · Google AI Studio / Gemini

Makine Öğrenmesi (ML Ops): Python · scikit-learn · skl2onnx · Hugging Face Hub (Sürümleme)

İstemci Tarafı Çıkarım (Inference): onnxruntime-web

Test & Doğrulama: Cypress

## Çalıştırma
Modeli eğitmek, referans çıktıları üretmek ve testleri çalıştırmak için terminalde şu komutları sırasıyla çalıştırmanız yeterlidir:

```bash
# 1. Gerekli Python kütüphanelerini kurun
pip install pandas scikit-learn skl2onnx onnxruntime "numpy<2"

# 2. Modeli eğitin ve Oracle (referans) test verilerini üretin
python train.py && python tests/parite.py

# 3. Web bağımlılıklarını kurup diferansiyel + E2E testleri çalıştırın
npm install
npx cypress run
```

## Bilinçli Olarak Yapılmayan Özellikler (Ürün Kararları)

1. **Kullanıcı hesabı yok:** Öğrenme hedefi karar akışıdır ve kişisel veri toplamak oyunun KVKK mesajıyla çelişirdi.
2. **Gerçek tehdit verisi yok:** Tüm log ve kişi verileri sentetiktir; böylece hem gerçek kişi verisi hem de gerçek saldırı bilgisi sızdırma riski sıfırlanır.
3. **Sunucu Tarafı Çıkarım Yok:** ML modeli veri gizliliğini maksimize etmek için API yerine doğrudan tarayıcıda (onnxruntime-web) çalıştırılmış, mimari ödünleşim (trade-off) olarak model ağırlıklarının gizliliğinden feragat edilmiştir.

## Yapay Zekâ (Coding Agent) Kullanım Beyanı
Bu projenin geliştirilme sürecinde yapay zeka araçları "Vizyon Mühendisliği" prensiplerine uygun olarak, kod kopyalamak için değil, süreci yönetmek ve kavramsallaştırmak için kullanılmıştır:

-Claude 3.5 Sonnet: train.py eğitim betiği, Oracle referans üreteci (tests/parite.py) ve Cypress diferansiyel parite testinin (spec.cy.js) temel matematiksel iskeletini oluşturmak için kullanıldı.

-Gemini 1.5 Pro: NumPy sürüm çakışması hatalarının çözümü, Hugging Face entegrasyon stratejisi ve test çıktılarının analizinde bir tartışma/hata ayıklama partneri olarak kullanıldı.

-İnsan Yönetimi ve Özgünleştirme: AI tarafından üretilen şablonlar doğrudan kabul edilmemiş, sistem yöneticisi olarak bizzat revize edilmiştir. data/oturumlar.csv verisi sentetik üretilmemiş, 3 farklı gerçek kullanıcıya oynatılarak manuel toplanmıştır. SINAV_TASARIMI.md ve RELEASE.md içeriklerindeki mimari ödünleşim (trade-off) analizleri, dersteki "3V Problemi" (Velocity, Validation, Versioning) konsepti temel alınarak özgün bir şekilde tasarlanmış ve kaleme alınmıştır.

## Lisans / Uyarı

Eğitim amaçlı kurgusal senaryodur; gerçek kişi, kurum veya olayla ilgisi yoktur.

