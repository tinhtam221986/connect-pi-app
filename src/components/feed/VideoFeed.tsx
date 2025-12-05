// Inside your Video Component loop
<button 
  className="absolute right-4 bottom-20 z-10 flex flex-col items-center gap-1"
  onClick={() => {
    // Optimistic UI Update
    setLikes(prev => prev + 1);
    // TODO: Call API to save like
  }}
>
  <div className="bg-black/50 p-3 rounded-full hover:bg-red-500/80 transition">
    ❤️
  </div>
  <span className="text-white text-xs font-bold">{likes}</span>
</button>
