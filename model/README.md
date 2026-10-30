# Model Kartı: Primer İpucu Yöneticisi (v2)

* **Amacı:** "The Primer" interaktif hikaye oyununda oyuncunun davranış profiline bakarak sahnede ipucuna (tutor desteğine) ihtiyacı olup olmadığını tahmin etmek.
* **Girdiler:** `seviye`, `karar_suresi_sn`, `onceki_yanlis_sayisi`
* **Çıktı:** İpucu gereklilik olasılığı (`ipucu_gerekti` = 1)
* **Model Tipi:** Lojistik Regresyon (`scikit-learn` üzerinden eğitilip `skl2onnx` ile ONNX'e dönüştürülmüştür)
* **Eğitim Verisi:** 3 gerçek kullanıcıdan toplanan 18 oturumluk karar noktası verisi (`data/oturumlar.csv`). Veride hiçbir kişisel veya demografik (ad, e-posta, konum) bilgi tutulmamıştır.
* **Metrikler ve Kabul Eşiği:** Doğruluk (Accuracy). Belirlenen kabul eşiği %70 olup, üretim sürümü eğitimde %75 doğruluk skoru elde ederek yayınlanmıştır (`config.json`).
* **Sınırlar ve Kullanılmaması Gereken Durumlar:** Model çok spesifik bir siber güvenlik kriz oyununa özgü tasarlanmıştır. Diğer uygulamalarda veya genel bilgi ölçme sınavlarında çalışmaz. Çok hızlı tıklayan ("Speedrunner") oyuncularda yanlış pozitif ipucu üretebilir.