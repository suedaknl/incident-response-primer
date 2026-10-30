# SE Primer - Veri Sözlüğü

Bu veri seti, The Primer uygulamasının 3 farklı gerçek kullanıcı tarafından oynanmasıyla elde edilen 18 karar noktası (satır) kaydından oluşmaktadır.

* **oturum:** Rastgele üretilmiş 4 haneli alfasayısal kimlik (KVKK gereği isim veya e-posta tutulmamıştır).
* **sahne_no:** Oyuncunun bulunduğu kriz/karar sahnesi (1, 2 veya 3).
* **seviye:** Oyuncunun oyun başında seçtiği deneyim seviyesi (0: Zor/İleri, 1: Orta, 2: Kolay/Başlangıç).
* **karar_suresi_sn:** Ekranda seçeneklerin belirmesiyle oyuncunun karar butonuna tıklaması arasında geçen süre (saniye cinsinden ondalıklı).
* **onceki_yanlis_sayisi:** Oyuncunun mevcut sahneye gelene kadar yaptığı "kötü son" eğilimli hatalı seçim sayısı (0, 1, 2).
* **ipucu_sayisi:** O ana kadar kullanılmış toplam yapay zeka ipucu sayısı.
* **ipucu_gerekti:** Hedef değişkenimiz (Label). 1 = Oyuncu uzun süre beklediği veya hata yapma eğiliminde olduğu için model ipucu verilmesine hükmetti. 0 = İpucu gerekmedi.
* **kaynak:** Verinin toplanma biçimi (Tümü `gercek` insan verisidir).
