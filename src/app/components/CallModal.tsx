import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, Maximize2 } from 'lucide-react';
import { toast } from 'sonner';

interface CallModalProps {
  partnerName: string;
  partnerAvatar: string;
  mode: 'audio' | 'video';
  onClose: () => void;
}

export function CallModal({ partnerName, partnerAvatar, mode, onClose }: CallModalProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(mode === 'video');
  const [elapsed, setElapsed] = useState(0);
  const [connecting, setConnecting] = useState(true);

  // Request media permissions and start local stream
  useEffect(() => {
    let localStream: MediaStream;

    const start = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: mode === 'video',
        });
        setStream(localStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
        // Simulate connection delay
        setTimeout(() => setConnecting(false), 1500);
      } catch (err: any) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          toast.error('Permissão de câmera/microfone negada. Verifique as configurações do browser.');
        } else if (err.name === 'NotFoundError') {
          toast.error('Câmera ou microfone não encontrado neste dispositivo.');
        } else {
          toast.error('Não foi possível iniciar a chamada.');
        }
        onClose();
      }
    };

    start();

    return () => {
      localStream?.getTracks().forEach(t => t.stop());
    };
  }, [mode, onClose]);

  // Timer
  useEffect(() => {
    if (connecting) return;
    const id = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [connecting]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const toggleMic = () => {
    if (!stream) return;
    stream.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
    setMicOn(v => !v);
  };

  const toggleCam = () => {
    if (!stream) return;
    stream.getVideoTracks().forEach(t => { t.enabled = !t.enabled; });
    setCamOn(v => !v);
  };

  const handleEnd = () => {
    stream?.getTracks().forEach(t => t.stop());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl w-full max-w-lg">

        {/* Video area */}
        {mode === 'video' ? (
          <div className="relative aspect-video bg-gray-800">
            {/* Remote (simulated — shows partner avatar) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {connecting ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full border-4 border-indigo-400 border-t-transparent animate-spin" />
                  <p className="text-white text-sm">A ligar para {partnerName}…</p>
                </div>
              ) : (
                <>
                  <img src={partnerAvatar} alt={partnerName} className="w-24 h-24 rounded-full border-4 border-white/20 object-cover" />
                  <p className="text-white mt-3 font-semibold">{partnerName}</p>
                  <p className="text-gray-400 text-sm mt-1">{formatTime(elapsed)}</p>
                </>
              )}
            </div>
            {/* Local preview (picture-in-picture) */}
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="absolute bottom-3 right-3 w-28 rounded-lg border-2 border-white/30 bg-black object-cover aspect-video"
            />
          </div>
        ) : (
          /* Audio call UI */
          <div className="flex flex-col items-center justify-center py-14 bg-gradient-to-b from-indigo-900 to-gray-900">
            <img src={partnerAvatar} alt={partnerName} className="w-24 h-24 rounded-full border-4 border-white/20 object-cover mb-4" />
            <p className="text-white text-xl font-semibold">{partnerName}</p>
            {connecting ? (
              <p className="text-indigo-300 text-sm mt-2 animate-pulse">A ligar…</p>
            ) : (
              <p className="text-gray-400 text-sm mt-2">{formatTime(elapsed)}</p>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 p-5 bg-gray-900">
          <button
            onClick={toggleMic}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${micOn ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
            title={micOn ? 'Silenciar' : 'Ativar microfone'}
          >
            {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {mode === 'video' && (
            <button
              onClick={toggleCam}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${camOn ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
              title={camOn ? 'Desligar câmera' : 'Ligar câmera'}
            >
              {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
          )}

          <button
            onClick={handleEnd}
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white transition-colors"
            title="Encerrar chamada"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
