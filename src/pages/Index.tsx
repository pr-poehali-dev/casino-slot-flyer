import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

type GameType = 'slots' | 'aviator' | 'minecraft' | 'sport' | null;

export default function Index() {
  const [balance, setBalance] = useState(1000);
  const [onlinePlayers, setOnlinePlayers] = useState(1247);
  const [currentSection, setCurrentSection] = useState<'home' | 'slots' | 'aviator' | 'minecraft' | 'sport' | 'profile' | 'admin' | 'bonuses' | 'support'>('home');
  const [isAdmin, setIsAdmin] = useState(true);
  const [recentWins, setRecentWins] = useState([
    { player: 'Игрок_4521', amount: 15000, game: 'Фруктовый слот' },
    { player: 'Игрок_8934', amount: 8500, game: 'Авиатор' },
    { player: 'Игрок_2341', amount: 12300, game: 'Майнкрафт' },
  ]);

  const [gameDialog, setGameDialog] = useState<GameType>(null);
  const [slotType, setSlotType] = useState<'fruits' | 'fish' | 'dog'>('fruits');
  
  const [slotResults, setSlotResults] = useState(['🍒', '🍋', '🍊']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(100);

  const [aviatorMultiplier, setAviatorMultiplier] = useState(1.00);
  const [aviatorActive, setAviatorActive] = useState(false);
  const [aviatorBet, setAviatorBet] = useState(100);
  const [aviatorPosition, setAviatorPosition] = useState(0);

  const [minecraftGrid, setMinecraftGrid] = useState(Array(25).fill('hidden'));
  const [minecraftBet, setMinecraftBet] = useState(100);
  const [minecraftActive, setMinecraftActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlinePlayers(prev => prev + Math.floor(Math.random() * 10) - 5);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (aviatorActive) {
      const interval = setInterval(() => {
        setAviatorMultiplier(prev => {
          const newMultiplier = prev + 0.01;
          setAviatorPosition(prev => prev + 2);
          
          if (Math.random() < 0.02) {
            setAviatorActive(false);
            toast.error('Самолет упал! 💥');
            return 1.00;
          }
          return newMultiplier;
        });
      }, 50);
      return () => clearInterval(interval);
    } else {
      setAviatorPosition(0);
    }
  }, [aviatorActive]);

  const spinSlots = () => {
    if (balance < betAmount) {
      toast.error('Недостаточно средств!');
      return;
    }
    
    setIsSpinning(true);
    setBalance(prev => prev - betAmount);
    
    const symbols = slotType === 'fruits' 
      ? ['🍒', '🍋', '🍊', '🍇', '🍉', '⭐']
      : slotType === 'fish'
      ? ['🐠', '🐟', '🐡', '🦈', '🐙', '⭐']
      : ['🐶', '🐕', '🦴', '🎾', '🏆', '⭐'];
    
    setTimeout(() => {
      const result = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ];
      setSlotResults(result);
      setIsSpinning(false);
      
      if (result[0] === result[1] && result[1] === result[2]) {
        const winAmount = betAmount * 10;
        setBalance(prev => prev + winAmount);
        toast.success(`Выигрыш ${winAmount}₽! 🎉`);
      }
    }, 1000);
  };

  const startAviator = () => {
    if (balance < aviatorBet) {
      toast.error('Недостаточно средств!');
      return;
    }
    setBalance(prev => prev - aviatorBet);
    setAviatorMultiplier(1.00);
    setAviatorActive(true);
  };

  const cashoutAviator = () => {
    if (!aviatorActive) return;
    const winAmount = Math.floor(aviatorBet * aviatorMultiplier);
    setBalance(prev => prev + winAmount);
    setAviatorActive(false);
    toast.success(`Выигрыш ${winAmount}₽! 🚀`);
  };

  const clickMinecraftCell = (index: number) => {
    if (!minecraftActive) {
      if (balance < minecraftBet) {
        toast.error('Недостаточно средств!');
        return;
      }
      setBalance(prev => prev - minecraftBet);
      setMinecraftActive(true);
    }

    if (minecraftGrid[index] !== 'hidden') return;

    const newGrid = [...minecraftGrid];
    const isBomb = Math.random() < 0.2;
    
    if (isBomb) {
      newGrid[index] = '💣';
      setMinecraftGrid(newGrid);
      setMinecraftActive(false);
      toast.error('Бомба! Игра окончена 💥');
      setTimeout(() => setMinecraftGrid(Array(25).fill('hidden')), 2000);
    } else {
      newGrid[index] = '💎';
      setMinecraftGrid(newGrid);
      const winAmount = Math.floor(minecraftBet * 1.5);
      setBalance(prev => prev + winAmount);
      toast.success(`+${winAmount}₽!`);
    }
  };

  const renderGameContent = () => {
    if (gameDialog === 'slots') {
      return (
        <div className="space-y-6">
          <div className="flex gap-2 justify-center">
            <Button 
              variant={slotType === 'fruits' ? 'default' : 'outline'}
              onClick={() => setSlotType('fruits')}
            >
              🍒 Фрукты
            </Button>
            <Button 
              variant={slotType === 'fish' ? 'default' : 'outline'}
              onClick={() => setSlotType('fish')}
            >
              🐠 Рыбка
            </Button>
            <Button 
              variant={slotType === 'dog' ? 'default' : 'outline'}
              onClick={() => setSlotType('dog')}
            >
              🐶 Собачка
            </Button>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg p-8 shadow-2xl">
            <div className="flex gap-4 justify-center items-center mb-6">
              {slotResults.map((symbol, idx) => (
                <div 
                  key={idx}
                  className={`text-7xl bg-white rounded-lg w-24 h-24 flex items-center justify-center shadow-lg ${isSpinning ? 'slot-spin' : ''}`}
                >
                  {symbol}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex gap-2 items-center justify-center">
                <Label className="text-white font-bold">Ставка:</Label>
                <Input 
                  type="number" 
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="w-32"
                />
              </div>
              
              <Button 
                onClick={spinSlots}
                disabled={isSpinning}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-xl py-6"
              >
                {isSpinning ? 'Крутим...' : 'КРУТИТЬ'}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (gameDialog === 'aviator') {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-8 shadow-2xl relative overflow-hidden h-80">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
            
            <div 
              className="text-6xl absolute transition-all duration-100"
              style={{ 
                bottom: `${aviatorPosition}px`, 
                left: '50%', 
                transform: 'translateX(-50%)',
              }}
            >
              ✈️
            </div>

            <div className="relative z-10">
              <div className="text-center mb-4">
                <div className="text-6xl font-black text-white neon-glow">
                  {aviatorMultiplier.toFixed(2)}x
                </div>
              </div>

              {!aviatorActive ? (
                <div className="space-y-4">
                  <div className="flex gap-2 items-center justify-center">
                    <Label className="text-white font-bold">Ставка:</Label>
                    <Input 
                      type="number" 
                      value={aviatorBet}
                      onChange={(e) => setAviatorBet(Number(e.target.value))}
                      className="w-32"
                    />
                  </div>
                  
                  <Button 
                    onClick={startAviator}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-xl py-6"
                  >
                    НАЧАТЬ ПОЛЁТ
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={cashoutAviator}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xl py-6"
                >
                  ЗАБРАТЬ {Math.floor(aviatorBet * aviatorMultiplier)}₽
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (gameDialog === 'minecraft') {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-lg p-8 shadow-2xl">
            <div className="grid grid-cols-5 gap-2 mb-6">
              {minecraftGrid.map((cell, idx) => (
                <button
                  key={idx}
                  onClick={() => clickMinecraftCell(idx)}
                  className={`aspect-square rounded-lg text-3xl flex items-center justify-center font-bold transition-all ${
                    cell === 'hidden' 
                      ? 'bg-green-600 hover:bg-green-500' 
                      : cell === '💣'
                      ? 'bg-red-600'
                      : 'bg-yellow-500'
                  }`}
                >
                  {cell !== 'hidden' ? cell : '?'}
                </button>
              ))}
            </div>

            {!minecraftActive && (
              <div className="flex gap-2 items-center justify-center mb-4">
                <Label className="text-white font-bold">Ставка:</Label>
                <Input 
                  type="number" 
                  value={minecraftBet}
                  onChange={(e) => setMinecraftBet(Number(e.target.value))}
                  className="w-32"
                />
              </div>
            )}

            <Button 
              onClick={() => {
                setMinecraftGrid(Array(25).fill('hidden'));
                setMinecraftActive(false);
              }}
              variant="outline"
              className="w-full"
            >
              НОВАЯ ИГРА
            </Button>
          </div>
        </div>
      );
    }

    if (gameDialog === 'sport') {
      return (
        <div className="space-y-4">
          <h3 className="font-bold text-xl">⚽ Футбол</h3>
          <Card className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">Реал Мадрид vs Барселона</p>
                <p className="text-sm text-muted-foreground">Сегодня 20:00</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">2.1</Button>
                <Button variant="outline" size="sm">3.4</Button>
                <Button variant="outline" size="sm">2.8</Button>
              </div>
            </div>
          </Card>

          <h3 className="font-bold text-xl">🏒 Хоккей</h3>
          <Card className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">ЦСКА vs Спартак</p>
                <p className="text-sm text-muted-foreground">Сегодня 19:30</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">1.8</Button>
                <Button size="sm" variant="outline">4.1</Button>
                <Button size="sm" variant="outline">3.2</Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return null;
  };

  const renderSection = () => {
    if (currentSection === 'home') {
      return (
        <div className="space-y-8">
          <div className="text-center py-12">
            <h1 className="text-6xl font-black mb-4 gold-gradient bg-clip-text text-transparent" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              🎰 ROYAL CASINO
            </h1>
            <p className="text-xl text-muted-foreground">Играй и выигрывай каждый день!</p>
          </div>

          <div className="bg-card rounded-lg p-6 border-2 border-primary/50">
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {recentWins.map((win, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-sm">{win.player}</span>
                    <span className="text-sm text-muted-foreground">{win.game}</span>
                    <span className="font-bold text-accent">+{win.amount}₽</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card 
              className="p-6 cursor-pointer game-card-hover bg-gradient-to-br from-purple-600 to-pink-600 border-0"
              onClick={() => setGameDialog('slots')}
            >
              <div className="text-center">
                <div className="text-5xl mb-2">🎰</div>
                <h3 className="font-bold text-white">Слоты</h3>
              </div>
            </Card>

            <Card 
              className="p-6 cursor-pointer game-card-hover bg-gradient-to-br from-blue-600 to-cyan-600 border-0"
              onClick={() => setGameDialog('aviator')}
            >
              <div className="text-center">
                <div className="text-5xl mb-2">✈️</div>
                <h3 className="font-bold text-white">Авиатор</h3>
              </div>
            </Card>

            <Card 
              className="p-6 cursor-pointer game-card-hover bg-gradient-to-br from-green-600 to-emerald-600 border-0"
              onClick={() => setGameDialog('minecraft')}
            >
              <div className="text-center">
                <div className="text-5xl mb-2">⛏️</div>
                <h3 className="font-bold text-white">Майнкрафт</h3>
              </div>
            </Card>

            <Card 
              className="p-6 cursor-pointer game-card-hover bg-gradient-to-br from-orange-600 to-red-600 border-0"
              onClick={() => setGameDialog('sport')}
            >
              <div className="text-center">
                <div className="text-5xl mb-2">⚽</div>
                <h3 className="font-bold text-white">Спорт</h3>
              </div>
            </Card>
          </div>
        </div>
      );
    }

    if (currentSection === 'profile') {
      return (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Личный кабинет</h2>
          
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID:</span>
                <span className="font-bold">USER_12345</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span>user@example.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Статус:</span>
                <Badge>VIP</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4">Пополнение баланса</h3>
            <div className="space-y-4">
              <Input type="number" placeholder="Сумма" />
              <Button className="w-full gold-gradient text-black font-bold">
                ПОПОЛНИТЬ
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    if (currentSection === 'admin' && isAdmin) {
      return (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Админ-панель</h2>
          
          <Tabs defaultValue="games">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="games">Игры</TabsTrigger>
              <TabsTrigger value="users">Пользователи</TabsTrigger>
              <TabsTrigger value="stats">Статистика</TabsTrigger>
            </TabsList>
            
            <TabsContent value="games" className="space-y-4">
              {['Слоты', 'Авиатор', 'Майнкрафт', 'Спорт'].map((game) => (
                <Card key={game} className="p-4 flex justify-between items-center">
                  <span className="font-bold">{game}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Включить</Button>
                    <Button size="sm" variant="destructive">Отключить</Button>
                  </div>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="users">
              <Card className="p-6">
                <p className="text-center text-muted-foreground">Всего пользователей: 1,247</p>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats">
              <Card className="p-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Общий оборот:</span>
                    <span className="font-bold">1,245,000₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Выигрыши:</span>
                    <span className="font-bold">892,000₽</span>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      );
    }

    if (currentSection === 'bonuses') {
      return (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Бонусы</h2>
          
          <Card className="p-6 bg-gradient-to-br from-yellow-500 to-orange-500 border-0">
            <div className="text-center text-white">
              <div className="text-5xl mb-2">🎁</div>
              <h3 className="text-2xl font-bold mb-2">Приветственный бонус</h3>
              <p className="text-4xl font-black mb-4">500₽</p>
              <Button className="bg-white text-black hover:bg-gray-100 font-bold">
                ПОЛУЧИТЬ БОНУС
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    if (currentSection === 'support') {
      return (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Поддержка</h2>
          
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">📧 Email</h3>
                <p className="text-muted-foreground">support@royalcasino.com</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">💬 Telegram</h3>
                <p className="text-muted-foreground">@royalcasino_support</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">⏰ Время работы</h3>
                <p className="text-muted-foreground">24/7</p>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <h1 
                className="text-2xl font-black gold-gradient bg-clip-text text-transparent cursor-pointer"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                onClick={() => setCurrentSection('home')}
              >
                🎰 ROYAL CASINO
              </h1>
              
              <nav className="hidden md:flex gap-4">
                <Button variant="ghost" onClick={() => setCurrentSection('home')}>
                  <Icon name="Home" size={18} className="mr-2" />
                  Главная
                </Button>
                <Button variant="ghost" onClick={() => setGameDialog('slots')}>
                  <Icon name="Sparkles" size={18} className="mr-2" />
                  Слоты
                </Button>
                <Button variant="ghost" onClick={() => setGameDialog('aviator')}>
                  <Icon name="Plane" size={18} className="mr-2" />
                  Авиатор
                </Button>
                <Button variant="ghost" onClick={() => setGameDialog('minecraft')}>
                  <Icon name="Box" size={18} className="mr-2" />
                  Майнкрафт
                </Button>
                <Button variant="ghost" onClick={() => setGameDialog('sport')}>
                  <Icon name="Trophy" size={18} className="mr-2" />
                  Спорт
                </Button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                <Icon name="Users" size={14} className="mr-1" />
                {onlinePlayers} онлайн
              </Badge>
              
              <div className="gold-gradient px-4 py-2 rounded-lg font-bold text-black">
                {balance}₽
              </div>

              <Button variant="outline" onClick={() => setCurrentSection('profile')}>
                <Icon name="User" size={18} />
              </Button>

              {isAdmin && (
                <Button variant="outline" onClick={() => setCurrentSection('admin')}>
                  <Icon name="Settings" size={18} />
                </Button>

              )}

              <Button variant="outline" onClick={() => setCurrentSection('bonuses')}>
                <Icon name="Gift" size={18} />
              </Button>

              <Button variant="outline" onClick={() => setCurrentSection('support')}>
                <Icon name="MessageCircle" size={18} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {renderSection()}
      </main>

      <Dialog open={gameDialog !== null} onOpenChange={() => setGameDialog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {gameDialog === 'slots' && '🎰 Слоты'}
              {gameDialog === 'aviator' && '✈️ Авиатор'}
              {gameDialog === 'minecraft' && '⛏️ Майнкрафт'}
              {gameDialog === 'sport' && '⚽ Ставки на спорт'}
            </DialogTitle>
          </DialogHeader>
          {renderGameContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
