import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityHeatmap from './components/ActivityHeatmap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  Download, TrendingUp, Target, Activity, Loader, 
  Sunrise, Sun, Sunset, Moon, RotateCw, BookOpen, 
  Clock, Heart, Award, CheckCircle2, XCircle, AlertCircle, Sparkles, CheckSquare
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useDashboard } from './useDashboard';
import { usePrayers } from '../prayers/usePrayers';
import { format } from 'date-fns';
import ErrorState from '../../components/common/ErrorState';
import DashboardSkeleton from './components/DashboardSkeleton';
import PageTransition from '../../components/common/PageTransition';

const HADITHS = [
  {
    text: "The first matter that the slave will be brought to account for on the Day of Judgment is the prayer. If it is sound, then the rest of his deeds will be sound.",
    source: "Hadith — Al-Tabarani"
  },
  {
    text: "Cleanliness is half of faith (Iman) and Alhamdulillah fills the scale.",
    source: "Hadith — Sahih Muslim"
  },
  {
    text: "The best of you are those who learn the Quran and teach it.",
    source: "Hadith — Sahih Al-Bukhari"
  },
  {
    text: "Riches are not from an abundance of worldly goods; rather, true richness is the richness of the soul.",
    source: "Hadith — Sahih Al-Bukhari"
  },
  {
    text: "Allah does not look at your figures or your outward appearance but He looks at your hearts and your deeds.",
    source: "Hadith — Sahih Muslim"
  },
  {
    text: "Do not show lethargy or negligence in giving Alms and Charity, for Charity extinguishes sin as water extinguishes fire.",
    source: "Hadith — Al-Tirmidhi"
  }
];

const DUAS = [
  {
    arabic: "رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ",
    transliteration: "Rabbana taqabbal minna innaka antas-Samee'ul-Aleem",
    translation: "Our Lord, accept [this] from us. Indeed You are the Hearing, the Knowing.",
    source: "Quran 2:127"
  },
  {
    arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ",
    transliteration: "Rabbij'alnee muqeemas-salaati wa min thurriyyatee Rabbana wa taqabbal du'aa",
    translation: "My Lord, make me an establisher of prayer, and [many] from my descendants. Our Lord, and accept my supplication.",
    source: "Quran 14:40"
  },
  {
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan waqina 'adhaban-nar",
    translation: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.",
    source: "Quran 2:201"
  },
  {
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    transliteration: "Rabbi zidnee 'ilma",
    translation: "My Lord, increase me in knowledge.",
    source: "Quran 20:114"
  }
];

const PRAYER_ICONS = {
  Fajr: { icon: Sunrise, color: 'text-sky-500 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30' },
  Dhuhr: { icon: Sun, color: 'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30' },
  Asr: { icon: Sun, color: 'text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30' },
  Maghrib: { icon: Sunset, color: 'text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30' },
  Isha: { icon: Moon, color: 'text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30' }
};

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    loading: statsLoading,
    error,
    summary,
    trends,
    fetchDashboardData,
    exportData
  } = useDashboard();

  const {
    todayPrayers,
    fetchTodayPrayers,
    updatePrayerStatus,
    loading: prayersLoading
  } = usePrayers();

  const [hadithIndex, setHadithIndex] = useState(0);
  const [duaIndex, setDuaIndex] = useState(0);
  const [hadithShuffling, setHadithShuffling] = useState(false);
  const [duaShuffling, setDuaShuffling] = useState(false);

  // Client side habit checklist
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('daily_habits');
    return saved ? JSON.parse(saved) : {
      quran: false,
      morningAdhkar: false,
      eveningAdhkar: false,
      charity: false
    };
  });

  useEffect(() => {
    localStorage.setItem('daily_habits', JSON.stringify(habits));
  }, [habits]);

  const toggleHabit = (key) => {
    setHabits(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    fetchDashboardData();
    fetchTodayPrayers();
  }, [fetchDashboardData, fetchTodayPrayers]);

  const handlePrayerToggle = async (prayerName, currentStatus, newStatus) => {
    // If clicking already selected status, revert to pending
    const statusToApply = currentStatus === newStatus ? 'pending' : newStatus;
    await updatePrayerStatus(prayerName, statusToApply);
    
    // Refresh stats to keep dashboard percentage & streaks in sync
    setTimeout(() => {
      fetchDashboardData();
    }, 500);
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getHijriDate = () => {
    try {
      return new Intl.DateTimeFormat('en-US-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(new Date());
    } catch (e) {
      return "Islamic Hijri Date";
    }
  };

  const triggerHadithShuffle = () => {
    setHadithShuffling(true);
    setTimeout(() => {
      setHadithIndex((prevIndex) => {
        let nextIndex = Math.floor(Math.random() * HADITHS.length);
        while (nextIndex === prevIndex && HADITHS.length > 1) {
          nextIndex = Math.floor(Math.random() * HADITHS.length);
        }
        return nextIndex;
      });
      setHadithShuffling(false);
    }, 200);
  };

  const triggerDuaShuffle = () => {
    setDuaShuffling(true);
    setTimeout(() => {
      setDuaIndex((prevIndex) => {
        let nextIndex = Math.floor(Math.random() * DUAS.length);
        while (nextIndex === prevIndex && DUAS.length > 1) {
          nextIndex = Math.floor(Math.random() * DUAS.length);
        }
        return nextIndex;
      });
      setDuaShuffling(false);
    }, 200);
  };

  const formattedTrends = trends?.map(item => ({
    ...item,
    formattedDate: (() => {
      try {
        const [year, month, day] = item.date.split('-');
        const date = new Date(year, month - 1, day);
        return format(date, 'MMM d');
      } catch (e) {
        return item.date;
      }
    })(),
    prayersCompleted: item.prayer?.completed || 0,
    duasCompleted: item.dua?.completed || 0
  })) || [];

  const loading = statsLoading && !summary;

  return (
    <PageTransition>
      <div className="space-y-8 pb-16">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              {getGreeting()}, {user?.name || 'User'}! 🌟
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
              <span>{format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
              <span className="text-gray-300 dark:text-charcoal-border">|</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{getHijriDate()}</span>
            </p>
          </div>
          <Button onClick={exportData} variant="secondary" className="flex items-center space-x-2 bg-white dark:bg-charcoal-surface border border-gray-200 dark:border-charcoal-border hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>

        {error && !loading && (
          <ErrorState 
            title="Failed to Load Dashboard" 
            message={error} 
            onRetry={fetchDashboardData} 
          />
        )}

        {loading ? (
          <DashboardSkeleton />
        ) : summary && !error ? (
          <>
            {/* Top Grid of Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Daily Completion Circle */}
              <Card className="p-6 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Today's prayers</span>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{summary?.todayCompletionPercent || 0}%</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{summary?.completedToday || 0} of 5 completed</p>
                </div>
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" className="stroke-gray-100 dark:stroke-charcoal-border fill-transparent" strokeWidth="6" />
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      className="stroke-emerald-500 fill-transparent transition-all duration-500 ease-out" 
                      strokeWidth="6" 
                      strokeDasharray={176} 
                      strokeDashoffset={176 - (176 * (summary?.todayCompletionPercent || 0)) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <Clock className="w-5 h-5 absolute text-emerald-500" />
                </div>
              </Card>

              {/* Current Streak Card */}
              <Card className="p-6 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Prayer Streak</span>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    {summary?.prayerStreak || 0} Days
                    {summary?.prayerStreak > 0 && <span className="animate-pulse">🔥</span>}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Longest: {summary?.streaks?.prayer?.longest || 0} days</p>
                </div>
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 rounded-2xl">
                  <Target className="w-6 h-6 text-rose-500" />
                </div>
              </Card>

              {/* Active Duas Card */}
              <Card className="p-6 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Active Duas</span>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{summary?.activeReminders || 0} Tracked</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Current Dua streak: {summary?.streaks?.dua?.current || 0}d</p>
                </div>
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 rounded-2xl">
                  <BookOpen className="w-6 h-6 text-amber-500" />
                </div>
              </Card>

              {/* Weekly comparison Card */}
              <Card className="p-6 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Weekly Prayers</span>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {summary?.weeklyComparison?.prayers?.thisWeek || 0}
                    {summary?.weeklyComparison?.prayers?.thisWeek >= summary?.weeklyComparison?.prayers?.lastWeek ? (
                      <span className="text-xs font-semibold text-emerald-500 flex items-center">+{(summary?.weeklyComparison?.prayers?.thisWeek - summary?.weeklyComparison?.prayers?.lastWeek)} this week</span>
                    ) : (
                      <span className="text-xs font-semibold text-rose-500 flex items-center">{(summary?.weeklyComparison?.prayers?.thisWeek - summary?.weeklyComparison?.prayers?.lastWeek)} this week</span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last week: {summary?.weeklyComparison?.prayers?.lastWeek || 0}</p>
                </div>
                <div className="p-3.5 bg-sky-50 dark:bg-sky-950/20 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-sky-500" />
                </div>
              </Card>
            </div>

            {/* Daily Action Panels (Two column layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Quick Prayer Logger (takes 2 cols on desktop) */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Interactive Prayer Quick Tracker */}
                <Card className="p-6 md:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-24 -mt-24 w-72 h-72 rounded-full bg-emerald-100/30 dark:bg-emerald-900/5 blur-3xl pointer-events-none"></div>
                  
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quick Log</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Mark your prayers for today directly from the home screen.</p>
                    </div>
                    {prayersLoading && <Loader className="w-4 h-4 text-emerald-500 animate-spin" />}
                  </div>

                  <div className="space-y-4">
                    {Object.keys(PRAYER_ICONS).map((prayerName) => {
                      const { icon: IconComponent, color } = PRAYER_ICONS[prayerName];
                      const currentStatus = todayPrayers[prayerName] || 'pending';
                      
                      return (
                        <div 
                          key={prayerName} 
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gray-50/50 dark:bg-charcoal-base/30 border border-gray-100 dark:border-charcoal-border hover:border-gray-200 dark:hover:border-charcoal-border/75 transition-colors gap-3"
                        >
                          <div className="flex items-center space-x-3.5">
                            <div className={`p-2.5 rounded-xl ${color}`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="font-semibold text-gray-900 dark:text-white">{prayerName}</span>
                              <span className="text-xs text-gray-400 block dark:text-gray-500">Today</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Completed Button */}
                            <button
                              onClick={() => handlePrayerToggle(prayerName, currentStatus, 'completed')}
                              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                                currentStatus === 'completed' 
                                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20' 
                                  : 'bg-white dark:bg-charcoal-surface border-gray-200 dark:border-charcoal-border text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Completed</span>
                            </button>

                            {/* Qaza Button */}
                            <button
                              onClick={() => handlePrayerToggle(prayerName, currentStatus, 'qaza')}
                              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                                currentStatus === 'qaza' 
                                  ? 'bg-amber-500 border-amber-500 text-white shadow-sm shadow-amber-500/20' 
                                  : 'bg-white dark:bg-charcoal-surface border-gray-200 dark:border-charcoal-border text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Qaza</span>
                            </button>

                            {/* Missed Button */}
                            <button
                              onClick={() => handlePrayerToggle(prayerName, currentStatus, 'missed')}
                              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                                currentStatus === 'missed' 
                                  ? 'bg-rose-500 border-rose-500 text-white shadow-sm shadow-rose-500/20' 
                                  : 'bg-white dark:bg-charcoal-surface border-gray-200 dark:border-charcoal-border text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Missed</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Activity Heatmap */}
                <Card className="p-6 md:p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    <span>Activity Heatmap</span>
                  </h3>
                  <ActivityHeatmap />
                </Card>

                {/* Trends Chart */}
                <Card className="p-6 md:p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    <span>Completion Trends</span>
                  </h3>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={formattedTrends} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                        <XAxis 
                          dataKey="formattedDate" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 8px 30px rgb(0,0,0,0.06)',
                            backgroundColor: 'var(--chart-tooltip-bg)',
                            color: 'var(--chart-tooltip-text)'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="prayersCompleted" 
                          name="Prayers"
                          stroke="var(--chart-primary)" 
                          strokeWidth={3} 
                          dot={{ r: 4, strokeWidth: 2 }}
                          activeDot={{ r: 6 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="duasCompleted" 
                          name="Duas"
                          stroke="var(--chart-secondary)" 
                          strokeWidth={3} 
                          dot={{ r: 4, strokeWidth: 2 }}
                          activeDot={{ r: 6 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* Right Column: Hadith Shuffler, Daily Checklist, Dua of the Day (takes 1 col) */}
              <div className="space-y-8">
                
                {/* Daily Hadith Card */}
                <Card className="p-6 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Daily Inspiration
                      </span>
                      <button 
                        onClick={triggerHadithShuffle} 
                        className={`p-1 text-gray-400 dark:text-gray-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors ${hadithShuffling ? 'animate-spin' : ''}`}
                        title="Shuffle Hadith"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="relative min-h-[90px]">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={hadithIndex}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.15 }}
                        >
                          <p className="text-sm font-serif italic text-gray-700 dark:text-gray-300 leading-relaxed">
                            "{HADITHS[hadithIndex].text}"
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                            — {HADITHS[hadithIndex].source}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </Card>

                {/* Dua of the Day Card */}
                <Card className="p-6 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5" />
                        Dua of the Day
                      </span>
                      <button 
                        onClick={triggerDuaShuffle} 
                        className={`p-1 text-gray-400 dark:text-gray-500 hover:text-amber-500 dark:hover:text-amber-400 transition-colors ${duaShuffling ? 'animate-spin' : ''}`}
                        title="Shuffle Dua"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="relative min-h-[140px] space-y-3">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={duaIndex}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.15 }}
                          className="space-y-3"
                        >
                          <p className="text-xl font-medium text-right text-emerald-800 dark:text-emerald-300 leading-loose font-serif">
                            {DUAS[duaIndex].arabic}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                            {DUAS[duaIndex].transliteration}
                          </p>
                          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-serif">
                            "{DUAS[duaIndex].translation}"
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            — {DUAS[duaIndex].source}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </Card>

                {/* Positive Habits / Daily Tasks Checklist */}
                <Card className="p-6">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                    <span>Spiritual Self-Reflection</span>
                  </h4>

                  <div className="space-y-3.5">
                    {/* Quran Reflection */}
                    <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 dark:bg-charcoal-base/20 border border-gray-100 dark:border-charcoal-border cursor-pointer select-none">
                      <div className="flex items-center space-x-3">
                        <input 
                          type="checkbox" 
                          checked={habits.quran}
                          onChange={() => toggleHabit('quran')}
                          className="rounded border-gray-300 dark:border-charcoal-border text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                        />
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-300">Read Quran Translation / Arabic</span>
                      </div>
                      <Award className={`w-4 h-4 transition-colors ${habits.quran ? 'text-emerald-500' : 'text-gray-300 dark:text-charcoal-border'}`} />
                    </label>

                    {/* Morning Adhkar */}
                    <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 dark:bg-charcoal-base/20 border border-gray-100 dark:border-charcoal-border cursor-pointer select-none">
                      <div className="flex items-center space-x-3">
                        <input 
                          type="checkbox" 
                          checked={habits.morningAdhkar}
                          onChange={() => toggleHabit('morningAdhkar')}
                          className="rounded border-gray-300 dark:border-charcoal-border text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                        />
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-300">Morning Adhkar (Remembrance)</span>
                      </div>
                      <Award className={`w-4 h-4 transition-colors ${habits.morningAdhkar ? 'text-emerald-500' : 'text-gray-300 dark:text-charcoal-border'}`} />
                    </label>

                    {/* Evening Adhkar */}
                    <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 dark:bg-charcoal-base/20 border border-gray-100 dark:border-charcoal-border cursor-pointer select-none">
                      <div className="flex items-center space-x-3">
                        <input 
                          type="checkbox" 
                          checked={habits.eveningAdhkar}
                          onChange={() => toggleHabit('eveningAdhkar')}
                          className="rounded border-gray-300 dark:border-charcoal-border text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                        />
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-300">Evening Adhkar (Remembrance)</span>
                      </div>
                      <Award className={`w-4 h-4 transition-colors ${habits.eveningAdhkar ? 'text-emerald-500' : 'text-gray-300 dark:text-charcoal-border'}`} />
                    </label>

                    {/* Sadaqah */}
                    <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 dark:bg-charcoal-base/20 border border-gray-100 dark:border-charcoal-border cursor-pointer select-none">
                      <div className="flex items-center space-x-3">
                        <input 
                          type="checkbox" 
                          checked={habits.charity}
                          onChange={() => toggleHabit('charity')}
                          className="rounded border-gray-300 dark:border-charcoal-border text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                        />
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-300">Sadaqah (Charity / Helping hand)</span>
                      </div>
                      <Award className={`w-4 h-4 transition-colors ${habits.charity ? 'text-emerald-500' : 'text-gray-300 dark:text-charcoal-border'}`} />
                    </label>
                  </div>
                </Card>

              </div>
            </div>
          </>
        ) : null}
      </div>
    </PageTransition>
  );
};

export default DashboardPage;
