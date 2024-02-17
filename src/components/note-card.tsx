import * as Dialog from '@radix-ui/react-dialog';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X } from 'lucide-react';

//Teste
import { WhatsappShareButton, WhatsappIcon } from 'react-share';

interface NoteCardProps {
  note: {
    id: string;
    date: Date;
    content: string;
    typeNote: string;
    priority?: string;
  };
  onNoteDeleted: (id: string) => void;
}

export function NoteCard({ note, onNoteDeleted }: NoteCardProps) {
  function compartilharNoWhatsApp() {
    let textoCompartilhado = `*|Tipo: ${note.typeNote} |* \n\nNota: ${note.content}`;

    if (note.typeNote === 'Tarefa') {
      textoCompartilhado = `*|Prioridade: ${note.priority} |* \n${textoCompartilhado}`;
    }

    window.open(
      `https://web.whatsapp.com/send?text=${encodeURIComponent(
        textoCompartilhado
      )}`
    );
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className='text-left rounded-md flex flex-col bg-slate-800 p-5 gap-3 overflow-hidden relative outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
        <span className='text-sm font-medium text-slate-300'>
          {formatDistanceToNow(note.date, {
            locale: ptBR,
            addSuffix: true,
          })}
        </span>
        <div className='absolute right-2 top-2'>
          <button onClick={compartilharNoWhatsApp}>
            <WhatsappShareButton
              url=''
              title='Compartilhar no WhatsApp'
              separator=':: '
              className=' hover:ring-2 hover:ring-green-300 rounded-full focus-visible:ring-1'
            >
              <WhatsappIcon size={26} round />
            </WhatsappShareButton>
          </button>
        </div>
        {note.typeNote === 'Tarefa' && (
          <div className='flex gap-2'>
            <span className='text-gray-200 text-sm bg-slate-500 p-1 rounded-md'>
              {note.typeNote}
            </span>
            <span className='text-gray-200 text-sm bg-slate-500 p-1 rounded-md'>
              Prioridade: {note.priority}
            </span>
          </div>
        )}

        <p className='text-sm leading-6 text-slate-400 break-all overflow-y-auto'>
          {note.content}
        </p>

        <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none' />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/60' />
        <Dialog.Content className='fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col'>
          <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
            <X className='size-5' />
          </Dialog.Close>
          <div className='flex flex-1 flex-col gap-3 p-5'>
            <span className='text-sm font-medium text-slate-300'>
              {formatDistanceToNow(note.date, {
                locale: ptBR,
                addSuffix: true,
              })}
            </span>
            {note.typeNote === 'Tarefa' && (
              <div className='flex gap-2'>
                <span className='text-gray-200 text-sm bg-slate-500 p-1 rounded-md'>
                  {note.typeNote}
                </span>
                <span className='text-gray-200 text-sm bg-slate-500 p-1 rounded-md'>
                  Prioridade: {note.priority}
                </span>
              </div>
            )}

            <p className='text-sm leading-6 text-slate-400 break-all overflow-y-scroll md:h-[40vh] h-[calc(100vh-120px)]'>
              {note.content}
            </p>
          </div>

          <button
            type='button'
            onClick={() => onNoteDeleted(note.id)}
            className='w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group'
          >
            Deseja{' '}
            <span className='text-red-400 group-hover:underline'>
              apagar essa nota?
            </span>
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
