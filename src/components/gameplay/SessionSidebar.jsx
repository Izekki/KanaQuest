import toriiLogo from '../../img/torii.svg';

export default function SessionSidebar() {
  return (
    <div className="flex items-center justify-center rounded-[1.75rem] border border-[#eaded6] bg-[#fbefe8] p-8 shadow-[0_14px_34px_rgba(128,43,56,0.08)]">
      <img src={toriiLogo} alt="KanaQuest" className="w-full max-w-[18.5rem] object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(18%) sepia(34%) saturate(1700%) hue-rotate(318deg) brightness(88%) contrast(94%)' }} />
    </div>
  );
}
