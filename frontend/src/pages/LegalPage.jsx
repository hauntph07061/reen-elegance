import { useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function LegalPage({ title, lastUpdated, children }) {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <main className="flex-grow pt-40 pb-20 bg-[#fbfaf8] text-[#2c2c2c] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-left mb-8">
            <h1 className="text-2xl md:text-3xl font-serif text-[#2c2c2c] tracking-wide mb-4">
              {title}
            </h1>
            {lastUpdated && (
              <p className="text-[#1b6060] text-sm uppercase tracking-widest font-bold">
                Cập nhật lần cuối: {lastUpdated}
              </p>
            )}
          </div>

          <article className="bg-white p-8 md:p-14 rounded-2xl shadow-sm border border-[#e8e0d5]">
            <div className="
              text-lg text-[#5a5a5a] leading-relaxed
              [&_h1]:text-3xl [&_h1]:font-serif [&_h1]:text-[#1b6060] [&_h1]:mb-6 [&_h1]:mt-8
              [&_h2]:text-2xl [&_h2]:font-serif [&_h2]:text-[#1b6060] [&_h2]:mb-4 [&_h2]:mt-8
              [&_h3]:text-xl [&_h3]:font-serif [&_h3]:text-[#1b6060] [&_h3]:mb-3 [&_h3]:mt-6
              [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-[#2c2c2c] [&_h4]:mb-2 [&_h4]:mt-4
              [&_p]:mb-4
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
              [&_li]:mb-2
              [&_strong]:font-bold [&_strong]:text-[#2c2c2c]
              [&_a]:text-[#1b6060] [&_a]:underline hover:[&_a]:text-[#144848]
            ">
              {children}
            </div>
          </article>
          
        </div>
      </main>
      <Footer />
    </>
  );
}
