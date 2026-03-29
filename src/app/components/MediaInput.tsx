import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Upload, Link, HardDrive, Cloud } from 'lucide-react';
import { toast } from 'sonner';

type MediaType = 'image' | 'video' | 'file' | 'any';

interface MediaInputProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  mediaType?: MediaType;
  className?: string;
  labelClassName?: string;
}

type Tab = 'upload' | 'url' | 'drive' | 'onedrive';

// Extracts a direct-usable URL from Google Drive share links
function normalizeDriveUrl(input: string): string {
  // https://drive.google.com/file/d/FILE_ID/view?...
  const fileMatch = input.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (fileMatch) return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
  // https://drive.google.com/open?id=FILE_ID
  const openMatch = input.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (openMatch) return `https://drive.google.com/uc?export=view&id=${openMatch[1]}`;
  return input;
}

// Extracts a direct-usable URL from OneDrive share links
function normalizeOneDriveUrl(input: string): string {
  // OneDrive embed: https://onedrive.live.com/embed?...
  if (input.includes('onedrive.live.com/embed')) return input;
  // OneDrive share: https://1drv.ms/... or https://onedrive.live.com/...
  // Convert to download link by replacing /view with /download
  return input.replace('/view?', '/download?').replace('redir?', 'download?');
}

export function MediaInput({
  label,
  value,
  onChange,
  accept,
  mediaType = 'any',
  className = '',
  labelClassName = '',
}: MediaInputProps) {
  const [tab, setTab] = useState<Tab>('upload');
  const [driveInput, setDriveInput] = useState('');
  const [onedriveInput, setOnedriveInput] = useState('');
  const [urlInput, setUrlInput] = useState(value || '');
  const fileRef = useRef<HTMLInputElement>(null);

  const defaultAccept =
    mediaType === 'image' ? 'image/*' :
    mediaType === 'video' ? 'video/*,video/mp4' :
    mediaType === 'file' ? '.pdf,.doc,.docx,.ppt,.pptx,.txt' :
    '*/*';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange(url);
    toast.success(`"${file.name}" carregado com sucesso.`);
  };

  const handleDriveConfirm = () => {
    if (!driveInput.trim()) return toast.error('Cole o link do Google Drive.');
    const url = normalizeDriveUrl(driveInput.trim());
    onChange(url);
    setDriveInput('');
    toast.success('Link do Google Drive aplicado.');
  };

  const handleOneDriveConfirm = () => {
    if (!onedriveInput.trim()) return toast.error('Cole o link do OneDrive.');
    const url = normalizeOneDriveUrl(onedriveInput.trim());
    onChange(url);
    setOnedriveInput('');
    toast.success('Link do OneDrive aplicado.');
  };

  const handleUrlConfirm = () => {
    if (!urlInput.trim()) return toast.error('Digite uma URL válida.');
    onChange(urlInput.trim());
    toast.success('URL aplicada.');
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'upload', label: 'Computador', icon: <Upload className="w-3.5 h-3.5" /> },
    { id: 'url',    label: 'URL',        icon: <Link className="w-3.5 h-3.5" /> },
    { id: 'drive',  label: 'Drive',      icon: <HardDrive className="w-3.5 h-3.5" /> },
    { id: 'onedrive', label: 'OneDrive', icon: <Cloud className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label className={labelClassName}>{label}</Label>}

      {/* Tab selector */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              tab === t.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Upload from computer */}
      {tab === 'upload' && (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="w-6 h-6 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Clique para selecionar um ficheiro</p>
          {value && <p className="text-xs text-indigo-600 mt-1 truncate max-w-xs">✓ Ficheiro carregado</p>}
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept={accept || defaultAccept}
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* Direct URL */}
      {tab === 'url' && (
        <div className="flex gap-2">
          <Input
            placeholder="https://..."
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUrlConfirm()}
          />
          <Button type="button" variant="outline" onClick={handleUrlConfirm}>Aplicar</Button>
        </div>
      )}

      {/* Google Drive */}
      {tab === 'drive' && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">
            No Google Drive, clique com o botão direito no ficheiro → <strong>Partilhar</strong> → <strong>Copiar link</strong> e cole abaixo.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="https://drive.google.com/file/d/..."
              value={driveInput}
              onChange={e => setDriveInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleDriveConfirm()}
            />
            <Button type="button" variant="outline" onClick={handleDriveConfirm}>Aplicar</Button>
          </div>
        </div>
      )}

      {/* OneDrive */}
      {tab === 'onedrive' && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">
            No OneDrive, clique em <strong>Partilhar</strong> → <strong>Copiar link</strong> e cole abaixo.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="https://1drv.ms/... ou https://onedrive.live.com/..."
              value={onedriveInput}
              onChange={e => setOnedriveInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleOneDriveConfirm()}
            />
            <Button type="button" variant="outline" onClick={handleOneDriveConfirm}>Aplicar</Button>
          </div>
        </div>
      )}

      {/* Preview of current value */}
      {value && (
        <p className="text-xs text-gray-400 truncate">
          Atual: <span className="text-indigo-500">{value}</span>
        </p>
      )}
    </div>
  );
}
