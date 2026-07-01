import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Leaf, ShieldCheck, HeartPulse, Recycle } from 'lucide-react';

export default function About() {
  const [settings, setSettings] = useState({
    about_story: '',
    about_vision: '',
    about_mission: '',
    about_image: ''
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/v1/settings`)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          setSettings(prev => ({...prev, ...data}));
        } else if (Array.isArray(data)) {
          const newSettings = {};
          data.forEach(item => { newSettings[item.settingKey] = item.settingValue; });
          setSettings(prev => ({...prev, ...newSettings}));
        }
      })
      .catch(e => console.error(e));
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-[#f6f3ed]">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1b6060]/10 text-[#1b6060] text-sm font-medium mb-6">
            <Leaf className="w-4 h-4" />
            <span>Câu chuyện của chúng tôi</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl text-[#2c2c2c] mb-6 leading-tight">
            Mang mảng xanh đến <br className="hidden md:block" /> mọi không gian sống
          </h1>
          <p className="text-[#5a5a5a] max-w-2xl text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
            {settings.about_story || 'Green Elegance ra đời với sứ mệnh kết nối con người với thiên nhiên, mang lại sự bình yên và tươi mát cho những ngôi nhà chật hẹp nơi đô thị ồn ào.'}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <img 
              src={settings.about_image || 'https://images.unsplash.com/photo-1416879598056-0cbb049bfd5a?auto=format&fit=crop&w=800&q=80'} 
              alt="Our Mission" 
              className="w-full h-[500px] object-cover rounded-3xl shadow-xl"
            />
          </div>
          <div className="order-1 md:order-2 space-y-8">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-[#1b6060] mb-4">Tầm nhìn</h2>
              <p className="text-[#5a5a5a] text-lg leading-relaxed whitespace-pre-wrap">
                {settings.about_vision || 'Trở thành thương hiệu hàng đầu cung cấp cây cảnh nghệ thuật và giải pháp không gian xanh tại Việt Nam. Chúng tôi tin rằng mỗi người đều xứng đáng có một góc nhỏ bình yên trong chính ngôi nhà của mình.'}
              </p>
            </div>
            <div className="h-px bg-[#e8e0d5] w-full"></div>
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-[#1b6060] mb-4">Sứ mệnh</h2>
              <p className="text-[#5a5a5a] text-lg leading-relaxed whitespace-pre-wrap">
                {settings.about_mission || 'Lan tỏa tình yêu thiên nhiên qua từng chậu cây được chăm chút tỉ mỉ. Chúng tôi không chỉ bán cây, mà còn đồng hành cùng bạn trên hành trình tạo dựng phong cách sống xanh, bền vững.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-[#f6f3ed]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-[#2c2c2c] mb-4">Giá trị cốt lõi</h2>
            <p className="text-[#5a5a5a] max-w-2xl mx-auto text-lg">
              Những tiêu chí tạo nên sự khác biệt của Green Elegance trong từng sản phẩm và dịch vụ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e8e0d5] hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-[#1b6060]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#1b6060]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#2c2c2c] mb-3">Chất lượng hàng đầu</h3>
              <p className="text-[#5a5a5a] leading-relaxed">
                100% cây cảnh được tuyển chọn và ươm trồng kỹ lưỡng từ các vườn ươm uy tín, đảm bảo cây khỏe mạnh khi đến tay khách hàng.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e8e0d5] hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-[#1b6060]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#1b6060]">
                <HeartPulse className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#2c2c2c] mb-3">Tận tâm phục vụ</h3>
              <p className="text-[#5a5a5a] leading-relaxed">
                Đội ngũ chuyên gia luôn sẵn sàng tư vấn cách chăm sóc, giải đáp mọi thắc mắc và hỗ trợ bảo hành tận tình.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e8e0d5] hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-[#1b6060]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#1b6060]">
                <Recycle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#2c2c2c] mb-3">Sống xanh bền vững</h3>
              <p className="text-[#5a5a5a] leading-relaxed">
                Ưu tiên sử dụng các vật liệu đóng gói thân thiện với môi trường, hạn chế rác thải nhựa để bảo vệ Trái Đất.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&q=80&w=1200" 
            alt="Pattern" 
            className="w-full h-full object-cover grayscale"
          />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-[#1b6060] mb-6">Bạn đã sẵn sàng phủ xanh không gian?</h2>
          <p className="text-[#5a5a5a] text-lg mb-10">
            Hãy cùng chúng tôi khám phá những chậu cây tuyệt đẹp đang chờ đón bạn.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-[#1b6060] text-white font-semibold px-10 py-4 rounded-xl hover:bg-[#144848] transition-colors shadow-xl shadow-[#1b6060]/20 text-lg"
          >
            Mua sắm ngay
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
