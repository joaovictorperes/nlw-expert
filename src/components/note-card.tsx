export function NoteCard() {
  return (
    <button className='text-left rounded-md bg-slate-800 p-5 space-y-3 overflow-hidden relative outline-none hover:ring-slate-600 hover:ring-2 focus-visible:ring-lime-400'>
      <span className='text-sm font-medium text-slate-300'>há 2 dias</span>
      <p className='text-sm leading-6 text-slate-400'>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum
        necessitatibus unde reiciendis perspiciatis. Dolorem culpa, omnis odit
        officia eos error quasi iusto sapiente architecto vel officiis
        distinctio dolore consequuntur minima. Lorem, ipsum dolor sit amet
        consectetur adipisicing elit. Excepturi, tempore cupiditate nisi
        consequatur eaque perspiciatis placeat iste, quisquam officia voluptate
        accusantium vel illo perferendis. Ab accusantium voluptas distinctio
        fuga repellendus?
      </p>

      <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none' />
    </button>
  );
}
