# SE Primer — Tasarım (DESIGN.md)

Mobil-öncelikli (390×844) 3 ekran. Tüm etkileşimli/doğrulanabilir öğeler `data-cy` etiketi taşır; Cypress testleri yalnızca bu etiketleri kullanır. UI Google Stitch ile üretilir, üretim sonrası etiketler elle eklenip bu listeyle doğrulanır.

## Ekran 1 — Giriş (`giris-screen`)

Amaç: seviye, rol ve hedefi almak; sentetik veri uyarısını göstermek.

| data-cy | Bileşen | Açıklama |
|---|---|---|
| `giris-screen` | Container | Ekran kökü |
| `giris-baslik` | Başlık | "SE Primer: Sızıntı Gecesi" |
| `sentetik-veri-uyarisi` | Banner | "Tüm veriler sentetiktir; gerçek kişi/tehdit verisi içermez." |
| `profil-seviye` | Select | `baslangic` / `orta` / `ileri` |
| `profil-rol` | Select | `mobil-gelistirici` / `devops` / `guvenlik-analisti` / `dpo` |
| `profil-hedef` | Text input | Serbest metin, en az 3 karakter |
| `baslat-btn` | Button | Üç alan dolmadan `disabled` |

## Ekran 2 — Karar Sahnesi (`sahne-screen`)

Amaç: hikâyeyi, Tutor'un Sokratik sorusunu ve 3 karardan birini göstermek.

| data-cy | Bileşen | Açıklama |
|---|---|---|
| `sahne-screen` | Container | Ekran kökü |
| `sahne-saat` | Metin/rozet | Oyun saati (ör. `02:35`) |
| `sahne-asama` | Stepper | "Karar 1/3", "Karar 2/3", "Karar 3/3" |
| `sahne-hikaye` | Kart | Tutor'un sahne anlatımı |
| `tutor-mesaj` | Balon | Tutor yanıtı (etiket hariç metin) |
| `tutor-yukleniyor` | Spinner | AI çağrısı sürerken görünür |
| `durum-etiketi` | Küçük metin | Ayrıştırılan `[DURUM: aşama=…; saat=…]` |
| `tutor-input` | Text input | Oyuncunun gerekçesi/cevabı |
| `tutor-gonder-btn` | Button | Gerekçeyi Tutor'a gönderir |
| `karar-baslik` | Başlık | Karar adı (Mimari/Müdahale, Test, KVKK/Adli Bilişim) |
| `karar-a-btn` | Seçenek kartı | Seçenek A (seçilince vurgulanır) |
| `karar-b-btn` | Seçenek kartı | Seçenek B |
| `karar-onayla-btn` | Button | Seçim yapılmadan `disabled`; onay sonrası geri dönüş yok |

## Ekran 3 — Sonuç (`sonuc-screen`)

Amaç: iyi/kötü sonu, nedenleri ve karar geçmişini göstermek; yansıtma sorularını sunmak.

| data-cy | Bileşen | Açıklama |
|---|---|---|
| `sonuc-screen` | Container | Ekran kökü |
| `sonuc-iyi` | Banner (yeşil) | Yalnızca İyi Son'da render edilir: "Sistem ayakta, zafiyet yamalandı, deliller korundu" |
| `sonuc-kotu` | Banner (kırmızı) | Yalnızca Kötü Son'da render edilir |
| `sonuc-saat` | Metin | Krizin bittiği saat |
| `sonuc-ozet` | Kart | Sonucun 2-3 cümlelik özeti |
| `sonuc-nedenler` | Liste | Kötü Son'da: "Zafiyet sürüyor" / "Deliller karartıldı" maddeleri |
| `karar-gecmisi` | Liste | K1/K2/K3 seçimleri ve saat maliyetleri |
| `debrief-mesaj` | Balon | Tutor'un yansıtma soruları |
| `tekrar-oyna-btn` | Button | Oyunu sıfırlar, Giriş ekranına döner |

## Etiket ve Durum Kuralları

- Etiket adları Türkçe, ASCII, `kebab-case`.
- `sonuc-iyi` ve `sonuc-kotu` aynı anda DOM'da bulunmaz (testler `should('not.exist')` ile doğrular).
- Oyun durumu (`k1`, `k2`, `k3`, `saat`, `sonuc`) istemcide tutulur; AI yanıtı yalnızca metin/etiket sağlar.
- Mobil: dokunma hedefleri ≥ 44px, tek kolon, ekranın altında sabit eylem çubuğu (`karar-onayla-btn`, `tutor-gonder-btn`).
