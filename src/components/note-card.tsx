import * as Dialog from '@radix-ui/react-dialog';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X, Pencil, Undo2 } from 'lucide-react';
import { ChangeEvent, useState } from 'react';

import { WhatsappShareButton, WhatsappIcon } from 'react-share';

interface NoteCardProps {
  note: {
    id: string;
    date: Date;
    content: string;
    typeNote: string;
    priority?: string;
    imageUrl?: string;
  };
  onNoteDeleted: (id: string) => void;
  onNoteEdited: (
    id: string,
    newContent: string,
    newTypeNote: string,
    newPriority?: string,
    newImageUrl?: string
  ) => void;
}

export function NoteCard({ note, onNoteDeleted, onNoteEdited }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(note.content);
  const [newTypeNote, setNewTypeNote] = useState(note.typeNote);
  const [newPriority, setNewPriority] = useState(note.priority);
  const [newImageUrl, setNewImageUrl] = useState(note.imageUrl);

  const [shouldShowNotePriority, setShouldShowNotePriority] = useState(
    note.typeNote === 'Tarefa' ? true : false
  );

  function handleEditNote() {
    setIsEditing(true);
  }

  function handleSaveEdit() {
    setIsEditing(false);
    onNoteEdited(note.id, newContent, newTypeNote, newPriority, newImageUrl);
  }

  function handleNoteTypeChange(event: ChangeEvent<HTMLSelectElement>) {
    event.target.value === 'Tarefa'
      ? setShouldShowNotePriority(true)
      : setShouldShowNotePriority(false);

    setNewTypeNote(event.target.value);
  }

  function handleChangePriority(event: ChangeEvent<HTMLSelectElement>) {
    setNewPriority(event.target.value);
  }

  function shareOnWhatsApp() {
    let isMobile = window.innerWidth <= 768;
    let sharedText = `*| [Tipo] : ${note.typeNote} |* \n\nNota: ${note.content}`;

    if (note.typeNote === 'Tarefa') {
      sharedText = `*| [Prioridade] : ${note.priority} |* \n${sharedText}`;
    }

    if (note.imageUrl) {
      const mensagem = `Confira esta imagem: ${note.imageUrl.replace(
        'blob:',
        ''
      )}`;
      sharedText = `${sharedText} \n\n${mensagem}`;
    }

    if (isMobile) {
      window.open(`whatsapp://send?text=${encodeURIComponent(sharedText)}`);
    } else {
      window.open(
        `https://web.whatsapp.com/send?text=${encodeURIComponent(sharedText)}`
      );
    }
  }

  function handleFileUpload(event: ChangeEvent<any>) {
    const file = event.target.files[0];
    const fileUrl = URL.createObjectURL(file);

    setNewImageUrl(fileUrl);
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
          <button onClick={shareOnWhatsApp}>
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
        <div className='flex gap-2'>
          <span className='text-gray-200 text-sm bg-slate-500 p-1 rounded-md'>
            {note.typeNote}
          </span>
          {note.typeNote === 'Tarefa' && (
            <span className='text-gray-200 text-sm bg-slate-500 p-1 rounded-md'>
              Prioridade: {note.priority}
            </span>
          )}
        </div>

        <p className='whitespace-pre-line text-sm leading-6 text-slate-400 break-all overflow-y-auto'>
          {note.content}
          <img src={note.imageUrl} />
        </p>

        <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none' />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/60' />
        <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full bg-slate-700 md:rounded-md flex flex-col '>
          <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
            <X className='size-5' />
          </Dialog.Close>
          <div className='flex flex-1 flex-col gap-3 p-5'>
            <div className='flex gap-6 place-items-center'>
              <span className='text-sm font-medium text-slate-300'>
                {formatDistanceToNow(note.date, {
                  locale: ptBR,
                  addSuffix: true,
                })}
              </span>
              {!isEditing ? (
                <div className='flex gap-2'>
                  <Pencil
                    className='size-7 bg-slate-800 p-0.5 text-slate-400 hover:text-slate-100 cursor-pointer rounded-md'
                    onClick={handleEditNote}
                  />
                  <span className='text-gray-200 text-sm bg-slate-500 p-1 px-2 rounded-md'>
                    {note.typeNote}
                  </span>
                  {note.typeNote === 'Tarefa' && (
                    <span className='text-gray-200 text-sm bg-slate-500 p-1 rounded-md'>
                      {note.priority}
                    </span>
                  )}
                </div>
              ) : (
                <div className='flex gap-2'>
                  <Undo2
                    className='size-7 bg-slate-800 p-0.5 text-slate-400 hover:text-slate-100 cursor-pointer rounded-md'
                    onClick={() => setIsEditing(false)}
                  />
                  {
                    <div className='flex gap-4'>
                      <select
                        defaultValue={note.typeNote}
                        className='text-gray-50 text-sm w-[90px] bg-slate-500 p-1 rounded-md 
                       outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'
                        name='tipoNota'
                        id='tipoNota'
                        onChange={handleNoteTypeChange}
                      >
                        <option
                          className='text-slate-200 bg-slate-700 border-none'
                          value='Nota Simples'
                        >
                          Nota Simples
                        </option>
                        <option
                          className='text-slate-200 bg-slate-700 border-none'
                          value='Tarefa'
                        >
                          Tarefa
                        </option>
                      </select>

                      {shouldShowNotePriority && (
                        <select
                          defaultValue={note.priority}
                          className='text-gray-100 text-sm bg-slate-500 rounded-md bg-transparent outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'
                          name='prioridade'
                          id='prioridade'
                          onChange={handleChangePriority}
                        >
                          <option
                            className='text-slate-200 bg-slate-700 border-none'
                            value='Baixa'
                          >
                            Baixa
                          </option>
                          <option
                            className='text-slate-200 bg-slate-700 border-none'
                            value='Média'
                          >
                            Média
                          </option>
                          <option
                            className='text-slate-200 bg-slate-700 border-none'
                            value='Alta'
                          >
                            Alta
                          </option>
                        </select>
                      )}
                    </div>
                  }
                </div>
              )}
            </div>

            {isEditing ? (
              <>
                <textarea
                  className='text-sm leading-6 text-slate-400 bg-transparent resize-none outline-none break-all overflow-y-scroll md:h-[40vh] max-h-[75vh] '
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />

                <div className='flex gap-2 items-center'>
                  <label
                    htmlFor='fileInput'
                    className='bg-slate-600 p-1 rounded-md text-sm outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 cursor-pointer'
                  >
                    Selecione uma imagem
                  </label>
                  <input
                    className='hidden'
                    type='file'
                    id='fileInput'
                    accept='image/*'
                    onChange={handleFileUpload}
                  />
                  {note.imageUrl && (
                    <a href={note.imageUrl} target='_blank'>
                      <img
                        id='previewImage'
                        src={newImageUrl}
                        alt='Prévia da imagem'
                        className='object-cover w-10 h-10 ring-slate-500 ring-2 hover:ring-lime-400'
                      />
                    </a>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className='whitespace-pre-line text-sm leading-6 text-slate-400 break-all overflow-y-scroll md:h-[40vh] max-h-[75vh]'>
                  {note.content}

                  {note.imageUrl && (
                    <a href={note.imageUrl} target='_blank'>
                      <img
                        id='previewImage'
                        src={note.imageUrl}
                        alt='Prévia da imagem'
                        className='m-1 object-cover w-full'
                      />
                    </a>
                  )}
                </p>
              </>
            )}
          </div>

          {isEditing ? (
            <button
              type='button'
              onClick={handleSaveEdit}
              className='w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group'
            >
              Deseja{' '}
              <span className='text-green-400 group-hover:underline'>
                salvar a edição?
              </span>
            </button>
          ) : (
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
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
