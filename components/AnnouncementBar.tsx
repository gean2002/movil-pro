import React from 'react';

const AnnouncementBar: React.FC = () => {
    return (
        <div className="bg-[#1d1d1f] text-[#f5f5f7] py-2 px-4 md:px-6">
            <div className="max-w-[1200px] mx-auto flex flex-row justify-between md:justify-center items-center gap-4 md:gap-8 text-[9px] md:text-[11px] font-medium tracking-wide">
                <div className="flex items-center gap-1.5 md:gap-2 group cursor-pointer whitespace-nowrap">
                    <span className="material-symbols-outlined text-[14px] md:text-[16px] text-[#a5be31] group-hover:scale-110 transition-transform">call</span>
                    <a href="tel:+51989000015" className="hover:text-white transition-colors uppercase">
                        +51 989 000 015
                    </a>
                </div>

                {/* Separator only visible on desktop if needed, but here we just use space or justified layout for mobile */}
                <div className="hidden md:block w-px h-3 bg-gray-700"></div>

                <div className="flex items-center gap-1.5 md:gap-2 group whitespace-nowrap overflow-hidden text-ellipsis">
                    <span className="material-symbols-outlined text-[14px] md:text-[16px] text-[#a5be31] group-hover:scale-110 transition-transform shrink-0">location_on</span>
                    <a
                        href="https://www.google.com/maps/place/MovilPro/@-8.1308952,-79.0364153,17z/data=!3m1!4b1!4m6!3m5!1s0x91ad3d000b0ef767:0x2f36504f390d7627!8m2!3d-8.1308952!4d-79.0338404!16s%2Fg%2F11v_59dl0s?entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoASAFQAw%3D%3D"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="uppercase text-gray-300 overflow-hidden text-ellipsis hover:text-white transition-colors"
                    >
                        Urb. San Eloy Mz. F Lt. 8, TRUJILLO
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementBar;
