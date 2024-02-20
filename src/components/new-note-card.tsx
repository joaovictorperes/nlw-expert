import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'sonner';

interface NewNoteCardProps {
  onNoteCreated: (content: string, typeNote: string, priority: string) => void;
}

let SpeechRecognition: SpeechRecognition | null = null;

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnboarding, setshouldShowOnboarding] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [content, setContent] = useState('');
  const [shouldShowNotePriority, setShouldShowNotePriority] = useState(false);
  const [priority, setPriority] = useState('Média');

  function handleStartEditor() {
    setshouldShowOnboarding(false);
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);

    if (event.target.value === '') {
      setshouldShowOnboarding(true);
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault();
    let typeNote;

    if (content === '') {
      toast.error('Nota não criada, Por favor, preencha o conteúdo.');
      return;
    }

    shouldShowNotePriority
      ? (typeNote = 'Tarefa')
      : (typeNote = 'Nota Simples');

    onNoteCreated(content, typeNote, priority);

    setContent('');
    setshouldShowOnboarding(true);

    toast.success('Nota criada com sucesso!');
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

    if (!isSpeechRecognitionAPIAvailable) {
      alert('Infelizmente seu navegador não tem suporte a API de gravação!');
      return;
    }

    setIsRecording(true);
    setshouldShowOnboarding(false);

    const SpeechRecogntionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    SpeechRecognition = new SpeechRecogntionAPI();

    SpeechRecognition.lang = 'pt-BR';
    SpeechRecognition.continuous = true;
    SpeechRecognition.maxAlternatives = 1;
    SpeechRecognition.interimResults = true;

    SpeechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, '');

      setContent(transcription);
    };

    SpeechRecognition.onerror = (event) => {
      console.error(event);
    };

    SpeechRecognition.start();
  }

  function handleStopRecording() {
    setIsRecording(false);

    if (SpeechRecognition !== null) {
      SpeechRecognition.stop();
    }
  }

  function handleNoteTypeChange(event: ChangeEvent<HTMLSelectElement>) {
    event.target.value === 'Tarefa'
      ? setShouldShowNotePriority(true)
      : setShouldShowNotePriority(false);
  }

  function handleChangePriority(event: ChangeEvent<HTMLSelectElement>) {
    setPriority(event.target.value);
  }

  function handleResetText() {
    setContent(' ');
    setshouldShowOnboarding(true);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className='rounded-md flex flex-col bg-slate-700 text-left p-5 space-y-3 outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
        <span className='text-sm font-medium text-slate-200'>
          Adicionar nota
        </span>
        <p className='text-sm leading-6 text-slate-400'>
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/60' />
        <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col'>
          <form onSubmit={handleSaveNote} className='flex-1 flex flex-col'>
            <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
              <X className='size-5' />
            </Dialog.Close>
            <div className='flex flex-1 flex-col gap-3 p-5'>
              <span className='text-sm font-medium text-slate-300'>
                Adicionar nota
              </span>

              {shouldShowOnboarding ? (
                <p className='text-sm leading-6 text-slate-400'>
                  Comece{' '}
                  <button
                    type='button'
                    onClick={handleStartRecording}
                    className='text-lime-400 outline-none font- hover:underline'
                  >
                    gravando uma nota
                  </button>{' '}
                  em áudio ou se preferir{' '}
                  <button
                    type='button'
                    onClick={handleStartEditor}
                    className='text-lime-400 outline-none font- hover:underline'
                  >
                    {' '}
                    utilize apenas texto
                  </button>
                  .
                </p>
              ) : (
                <div>
                  <div className='flex mb-4 justify-between'>
                    <div className='flex gap-5'>
                      <select
                        defaultValue='Nota Simples'
                        className='text-slate-100 rounded-md bg-slate-500 p-1 outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 box-border'
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
                          defaultValue='Média'
                          className='text-slate-200 rounded-md bg-transparent outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'
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
                    <button
                      className='bg-slate-600 p-1 rounded-md text-sm outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'
                      onClick={handleResetText}
                    >
                      Limpar
                    </button>
                  </div>

                  <textarea
                    autoFocus
                    className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                    placeholder='Escreva uma nota...'
                    onChange={handleContentChanged}
                    value={content}
                  />
                </div>
              )}
            </div>

            {isRecording ? (
              <button
                type='button'
                onClick={handleStopRecording}
                className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100'
              >
                <div className='size-3 rounded-full bg-red-500 animate-pulse' />
                Gravando! (clique p/ interromper)
              </button>
            ) : (
              <button
                type='button'
                onClick={handleSaveNote}
                className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500'
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
