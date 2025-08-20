import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- Custom Hook for LocalStorage ---
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === 'undefined') return initialValue;
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) { return initialValue; }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) { console.error(error); }
    };
    return [storedValue, setValue];
}

// --- SVG İkonları ---
const SearchIcon = ({className}) => ( <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> );
const LoaderIcon = ({className}) => ( <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> );
const SunIcon = ({className}) => ( <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg> );
const MoonIcon = ({className}) => ( <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> );
const HistoryIcon = ({className}) => ( <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6"></path><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg> );
const XIcon = ({className}) => ( <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> );
const PlayIcon = ({className}) => ( <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> );
const DownloadIcon = ({className}) => ( <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> );
const MusicIcon = ({className}) => ( <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg> );
const ClipboardIcon = ({className}) => ( <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg> );
const SettingsIcon = ({className}) => ( <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> );

// --- Ana Uygulama ---
export default function App() {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [globalError, setGlobalError] = useState(null);
    const [activePlayer, setActivePlayer] = useState(null);
    const [activeModal, setActiveModal] = useState(null);
    const [activeJobs, setActiveJobs] = useState({});
    
    const [theme, setTheme] = useLocalStorage('theme', 'dark');
    const [history, setHistory] = useLocalStorage('history', []);

    const API_KEY = "e79abad24dmsh7c8d51f6151c12dp1f7340jsne83c3325c9ee";
    const SEARCH_API_HOST = 'youtube-search-and-download.p.rapidapi.com';
    const DOWNLOAD_API_HOST = 'fast-youtube-mp4-mp3-downloader.p.rapidapi.com';

    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.documentElement.classList.remove(theme === 'dark' ? 'light' : 'dark');
            document.documentElement.classList.add(theme);
        }
    }, [theme]);

    const handleSearch = async () => {
        setGlobalError(null);
        if (query.trim() === '') return;
        setIsSearching(true);
        setSearchResults([]);
        try {
            const response = await fetch(`https://${SEARCH_API_HOST}/search?query=${encodeURIComponent(query)}`, {
                headers: { 'X-RapidAPI-Key': API_KEY, 'X-RapidAPI-Host': SEARCH_API_HOST },
            });
            const data = await response.json();
            if (data.message) throw new Error(data.message);
            setSearchResults(data.contents?.filter(item => item.video) || []);
        } catch (err) {
            setGlobalError(`Arama hatası: ${err.message}`);
        } finally {
            setIsSearching(false);
        }
    };
    
    const pasteFromClipboard = async () => {
        try {
            if (navigator.clipboard) {
                const text = await navigator.clipboard.readText();
                setQuery(text);
            }
        } catch (err) { console.error('Pano okunamadı:', err); }
    };

    const addToHistory = useCallback((videoInfo) => {
        setHistory(prev => {
            const newHistory = [{...videoInfo, videoId: videoInfo.id || videoInfo.videoId}, ...prev.filter(v => (v.id || v.videoId) !== (videoInfo.id || videoInfo.videoId))];
            return newHistory.slice(0, 50);
        });
    }, [setHistory]);

    // --- Arayüz Bileşenleri ---

    const VideoCard = ({ videoData }) => {
        const video = videoData.video;
        const [job, setJob] = useState({ status: 'idle' });
        const [isExpanded, setIsExpanded] = useState(false);

        const startDownloadJob = useCallback(async (format) => {
            setJob({ status: 'pending', error: null, format: format });
            try {
                const response = await fetch(`https://${DOWNLOAD_API_HOST}/download`, {
                    method: 'POST',
                    headers: { 'X-Rapidapi-Key': API_KEY, 'X-Rapidapi-Host': DOWNLOAD_API_HOST, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: `https://www.youtube.com/watch?v=${video.videoId}`, format }),
                });
                const data = await response.json();
                if (!data.success || !data.jobId) {
                    throw new Error(data.message || 'API isteği başlatılamadı.');
                }
                setJob(prev => ({ ...prev, jobId: data.jobId }));
            } catch (err) {
                let errorMessage = err.message;
                if (err.message.includes('exceeded the MONTHLY quota')) {
                    errorMessage = "Aylık API kullanım limitiniz doldu.";
                }
                setJob({ status: 'error', error: errorMessage });
            }
        }, [video.videoId]);

        useEffect(() => {
            if (job.status !== 'pending' || !job.jobId) return;

            const interval = setInterval(async () => {
                try {
                    const response = await fetch(`https://${DOWNLOAD_API_HOST}/${job.jobId}`, {
                        headers: { 'X-Rapidapi-Key': API_KEY, 'X-Rapidapi-Host': DOWNLOAD_API_HOST },
                    });
                    const data = await response.json();
                    if (data.status === 'completed') {
                        clearInterval(interval);
                        if (job.format === 'watch') {
                            setActivePlayer(data);
                            setJob({ status: 'idle' });
                        } else {
                            setJob({ status: 'completed', info: data });
                        }
                        addToHistory(data);
                    } else if (data.status === 'failed') {
                        clearInterval(interval);
                        let errorMessage = data.message || 'Video işlenemedi.';
                        if (errorMessage.includes('longer than 15 minutes')) {
                            errorMessage = 'Bu video çok uzun olduğu için işlenemedi.';
                        }
                        throw new Error(errorMessage);
                    }
                } catch (err) {
                    clearInterval(interval);
                    setJob({ status: 'error', error: err.message });
                }
            }, 4000);

            return () => clearInterval(interval);
        }, [job, addToHistory]);

        return (
            <div className="bg-white dark:bg-gray-800/80 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 shadow-sm hover:shadow-lg">
                <img src={video.thumbnails[video.thumbnails.length - 1].url} alt={video.title} className="w-full h-auto aspect-video object-cover" />
                <div className="p-4">
                    <h3 className="font-semibold text-base text-gray-800 dark:text-gray-100 line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{video.channelName}</p>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {job.status === 'pending' ? (
                             <button disabled className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white font-semibold py-2 rounded-lg cursor-wait">
                                <LoaderIcon className="w-5 h-5"/> İşleniyor...
                            </button>
                        ) : job.status === 'completed' ? (
                            <div className="flex gap-3 animate-fade-in">
                                <button onClick={() => setActivePlayer(job.info)} className="flex-1 flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg transition">
                                    <PlayIcon className="w-5 h-5"/> İzle
                                </button>
                                <a href={job.info.downloadUrl} download target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
                                    <DownloadIcon className="w-5 h-5"/> Kaydet
                                </a>
                            </div>
                        ) : (
                             <div className="flex gap-3">
                                <button onClick={() => startDownloadJob('watch')} disabled={job.status === 'pending'} className="flex-1 flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg transition">
                                    <PlayIcon className="w-5 h-5"/> İzle
                                </button>
                                <button onClick={() => setIsExpanded(p => !p)} disabled={job.status === 'pending'} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
                                    <DownloadIcon className="w-5 h-5"/> İndir
                                </button>
                            </div>
                        )}

                        {job.error && <p className="text-red-500 text-center text-sm mt-3">{job.error}</p>}
                    </div>

                    {isExpanded && job.status !== 'pending' && job.status !== 'completed' && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fade-in space-y-3">
                            <button onClick={() => startDownloadJob('mp4')} className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition">
                                <DownloadIcon className="w-5 h-5"/> MP4 Olarak İşle
                            </button>
                            <button onClick={() => startDownloadJob('mp3')} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition">
                                <MusicIcon className="w-5 h-5"/> MP3 Olarak İşle
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const SearchSkeleton = () => (
        <div className="bg-white dark:bg-gray-800/80 rounded-xl overflow-hidden animate-pulse border border-gray-200 dark:border-gray-700">
            <div className="w-full aspect-video bg-gray-300 dark:bg-gray-700"></div>
            <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen font-sans transition-colors duration-300">
            <div className="w-full max-w-3xl mx-auto p-4">
                <header className="flex justify-between items-center my-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                        uyaTube
                    </h1>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setActiveModal('settings')} className="text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition">
                            <SettingsIcon className="w-6 h-6"/>
                        </button>
                        <button onClick={() => setActiveModal('history')} className="text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition">
                            <HistoryIcon className="w-6 h-6"/>
                        </button>
                        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition">
                            {theme === 'dark' ? <SunIcon className="w-6 h-6"/> : <MoonIcon className="w-6 h-6"/>}
                        </button>
                    </div>
                </header>

                <main className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-4 z-10">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="relative flex-grow">
                             <input
                                type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Video adı veya linki..."
                                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                            />
                            <button onClick={pasteFromClipboard} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500">
                                <ClipboardIcon className="w-5 h-5"/>
                            </button>
                        </div>
                        <button onClick={handleSearch} disabled={isSearching} className="flex-shrink-0 p-3.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-300">
                            {isSearching ? <LoaderIcon className="w-5 h-5"/> : <SearchIcon className="w-5 h-5"/>}
                        </button>
                    </div>
                    {globalError && <div className="mt-4 text-center text-red-500 dark:text-red-400">{globalError}</div>}
                </main>

                <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isSearching && Array.from({ length: 4 }).map((_, i) => <SearchSkeleton key={i} />)}
                    {searchResults.map((item) => <VideoCard key={item.video.videoId} videoData={item} />)}
                </section>
                
                <footer className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                    © islekApps 2025
                </footer>
            </div>

            {activePlayer && (
                <div className="fixed inset-0 w-screen h-screen bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setActivePlayer(null)}>
                    <div className="w-full h-full max-w-4xl p-0 md:p-4" onClick={(e) => e.stopPropagation()}>
                         <div className="bg-gray-900 rounded-none md:rounded-lg shadow-2xl overflow-hidden border border-gray-700 flex flex-col w-full h-full">
                            <div className="flex justify-between items-center p-3 bg-gray-800/50 border-b border-gray-700">
                                <h3 className="text-white font-semibold truncate pr-4">{activePlayer.title}</h3>
                                <button onClick={() => setActivePlayer(null)} className="text-gray-400 hover:text-white flex-shrink-0"><XIcon className="w-6 h-6"/></button>
                            </div>
                            <div className="w-full flex-grow bg-black flex items-center justify-center">
                                <video className="w-full h-auto max-h-full" src={activePlayer.downloadUrl} controls autoPlay>Tarayıcınız video etiketini desteklemiyor.</video>
                            </div>
                         </div>
                    </div>
                </div>
            )}
            
            {activeModal && (
                 <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-start z-50 animate-fade-in p-4 overflow-y-auto" onClick={() => setActiveModal(null)}>
                    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 my-8" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold">
                                {activeModal === 'history' ? 'İndirme Geçmişi' : 'Ayarlar'}
                            </h2>
                            <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-800 dark:hover:text-white"><XIcon className="w-6 h-6"/></button>
                        </div>
                        <div className="p-4 max-h-[70vh] overflow-y-auto">
                            {activeModal === 'history' && (
                                history.length > 0 ? (
                                    <div className="space-y-4">
                                        {history.map(video => (
                                            <div key={video.videoId || video.id} className="flex items-center gap-4">
                                                <img src={video.thumbnail} alt={video.title} className="w-24 h-14 object-cover rounded-md flex-shrink-0"/>
                                                <div>
                                                    <p className="font-semibold line-clamp-2">{video.title}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{video.channel || video.uploader}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-8">Geçmişinizde henüz bir şey yok.</p>
                                )
                            )}
                            {activeModal === 'settings' && (
                                <div className="space-y-4 text-sm">
                                    <p className="text-gray-600 dark:text-gray-300">Bu uygulama, aşağıdaki RapidAPI servislerini kullanmaktadır. Servislerin limitlerini ve durumlarını kontrol etmek için linkleri ziyaret edebilirsiniz.</p>
                                    <a href="https://rapidapi.com/h0p3rwe/api/youtube-search-and-download/" target="_blank" rel="noopener noreferrer" className="block text-purple-500 hover:underline">1. YouTube Arama API'si</a>
                                    <a href="https://rapidapi.com/mmmkill799/api/fast-youtube-mp4-mp3-downloader/" target="_blank" rel="noopener noreferrer" className="block text-purple-500 hover:underline">2. YouTube İndirme API'si</a>
                                </div>
                            )}
                        </div>
                    </div>
                 </div>
            )}

            <style jsx global>{`
              @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
              .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
              .line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
            `}</style>
        </div>
    );
}
