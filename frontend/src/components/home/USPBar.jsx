import React from 'react'

function USPBar() {
  const usps = [
    {
      icon: (
        <svg className="w-8 h-8 text-[#1b6060]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      title: "Vận Chuyển Miễn Phí",
      desc: "Giao hoa hỏa tốc nội thành trong 2H"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-[#1b6060]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Hoa Tươi Mỗi Ngày",
      desc: "Tặng kèm thiệp thiết kế cao cấp"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-[#1b6060]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Đổi Trả Miễn Phí",
      desc: "Hoàn tiền 100% nếu hoa héo, dập nát"
    }
  ]

  return (
    <div className="w-full bg-white/80 border-y border-[#e8e0d5] backdrop-blur-sm py-8 mt-12 mb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {usps.map((usp, idx) => (
            <div key={idx} className={`flex items-center gap-5 ${idx !== 0 ? 'pt-8 md:pt-0 md:pl-8 lg:pl-12' : ''} group`}>
              <div className="w-16 h-16 rounded-2xl bg-[#f6f3ed] border border-[#e8e0d5] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#f0ebe4] transition-all duration-300 shadow-lg">
                {usp.icon}
              </div>
              <div className="flex flex-col text-left">
                <h3 className="text-[#2c2c2c] font-bold text-base tracking-wide mb-1 group-hover:text-[#1b6060] transition-colors">
                  {usp.title}
                </h3>
                <p className="text-[#5a5a5a] text-sm">
                  {usp.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default USPBar
