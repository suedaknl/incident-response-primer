# Sürüm Notları - v2.0 (The Primer ML Entegrasyonu)

Bu sürümle birlikte The Primer uygulamasına oyuncunun davranışlarına göre uyumlanan Makine Öğrenmesi (ML) modeli entegre edilmiştir.

* **Sürümleme ve Rollback:** Model `model.onnx` olarak Hugging Face üzerinde barındırılmış ve `index.html` içinde spesifik bir Commit SHA (`7e33bed`) URL'sine sabitlenmiştir. Modelde beklenmedik bir regresyon oluşursa, `index.html` içindeki URL'nin v1'e karşılık gelen eski bir commit SHA ile değiştirilmesi saniyeler içinde "rollback" (geri alma) sağlayacaktır.

* **Yeni Sürümü Güvenle Devreye Alma:** Yeni ML sürümü doğrudan %100 kullanıcı trafiğine açılmamıştır. Uygulamanın geliştirme aşamasında **Shadow Deployment (Gölge Dağıtım)** simüle edilmiş, model arka planda olasılık hesaplayıp Cypress ile Oracle parite testlerine sokulmuştur. Kullanıcılar modelin kararlarını sadece hata toleransı (`< 1e-4`) doğrulandıktan sonra görecektir.

* **Mimari Dağıtım Kararı ve Ödünleşim (Trade-off):** 
  * *İnternet Zorunluluğu:* Model `onnxruntime-web` ile tarayıcıda çalıştığı için internet bağlantısı sadece uygulamanın ve modelin ilk yüklenmesi (latency) için gerekir. Sonrasında kesintisiz çalışır.
  * *Veri Gizliliği:* Karar süresi ve tıklama verileri tarayıcıdan çıkmaz (sunucuya gitmez), cihaz içinde işlenir.
  * *Ödünleşim:* Veri gizliliği (KVKK uyumu) maksimize edilmiş, ancak tarayıcıda çalıştırıldığı için model ağırlıkları (`model.onnx`) herkese açık hale gelmiş (gizlilikten feragat edilmiş) ve tersine mühendislik riski alınmıştır.