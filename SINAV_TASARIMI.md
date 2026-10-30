# Düşünce Egzersizi: Vize Sınavı Tasarımı

*The Primer oyuncuyla uyumlanan bir sistemdi. Peki, öğrencinin ezberini değil, "Vizyon Mühendisliğini" ve kavramların özünü ölçen, bana uyumlanan bir sınav sorusu nasıl olurdu?*

## Benim Sınav Sorum: "Kriz Anında Mimari Kararlar"

**Senaryo:** 
Büyük bir bankanın siber güvenlik ekibi, oltalama (phishing) e-postalarını anında yakalayan küçük (dikey) bir makine öğrenmesi modeli eğitiyor. Ekip, çalışanların bilgisayarlarında gecikme (latency) olmasın ve internet gitse bile model çalışsın diye modeli doğrudan tarayıcı eklentisine gömüyor (`onnxruntime-web`). Ancak bazı eski nesil şirket bilgisayarlarında ilk yükleme anında tarayıcı donuyor. 
Bunun üzerine yönetim, modeli merkezi bir sunucuya (API) taşımayı öneriyor ama güvenlik ekibi "Bankanın gizli iç yazışmaları dışarı çıkamaz!" diyerek itiraz ediyor. Bu sırada ekip, modelin v2.0 sürümünü geliştiriyor ancak eski modeli tamamen silmeden önce v2.0'ın gerçek oltalama maillerindeki performansını çalışanlara hissettirmeden ölçmek istiyor.

**Soru:** Bu olay örgüsünde yaşanan krizi ve ekibin atması gereken adımları hangi mühendislik kavramları açıklar? (Doğru cevap sayısı: 3)

**Beklenen Temel Kavramlar (Cevap Anahtarı):**
1. **Mimari Ödünleşim (Trade-off):** Tarayıcıda çalıştırmanın getirdiği veri gizliliği (veri cihazdan çıkmaz) ile API'ye taşımanın getirdiği hız/performans arasındaki zorunlu fedakarlık kararı.
2. **Gölge Dağıtım (Shadow Deployment):** v2.0 modelini canlıya almadan önce, mevcut trafik (gerçek mailler) üzerinde sessizce arka planda çalıştırıp eski sürümle çıktılarının kıyaslanması.
3. **Model Boyutu ve Çıkarım (Inference) Maliyeti:** Tarayıcının donması, istemci tarafındaki (client-side) donanım yetersizliğiyle ilgilidir; küçük göreve özel modellerin tercih edilme sebebini doğrular.

**Çeldiriciler (Yanlış Seçenekler):** 
*Diferansiyel Test (burada iki kodun değil, operasyonel bir sürecin kıyası var), JSON Şema Doğrulaması, Prompt Injection (Model dil modeli değil, tabular siber güvenlik sınıflandırıcısıdır).*

**Öz Değerlendirme:** Bu soru, bir yazılım mühendisinin modeli sadece eğitmeyi değil; verinin gizliliğini (KVKK), uygulamanın çalışacağı donanımı ve yeni sürümü (Versioning) canlıya alırken kullanıcıyı riske atmamayı (Shadowing) aynı anda düşünmesini ölçer.