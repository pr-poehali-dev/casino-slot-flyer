import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

type Section = 'dashboard' | 'portfolio' | 'invest' | 'analytics' | 'transactions' | 'settings' | 'admin';
type AssetType = 'gold' | 'silver' | 'realestate' | 'construction' | 'stocks' | 'crypto';

interface Investment {
  id: string;
  type: AssetType;
  amount: number;
  date: string;
  currentValue: number;
  profit: number;
}

interface Asset {
  type: AssetType;
  name: string;
  icon: string;
  price: number;
  change24h: number;
  totalInvested: number;
}

export default function Invest() {
  const [currentSection, setCurrentSection] = useState<Section>('dashboard');
  const [balance, setBalance] = useState(100000);
  const [totalProfit, setTotalProfit] = useState(12450);
  const [isAdmin, setIsAdmin] = useState(true);

  const [assets, setAssets] = useState<Asset[]>([
    { type: 'gold', name: 'Золото', icon: '🥇', price: 5850, change24h: 2.3, totalInvested: 25000 },
    { type: 'silver', name: 'Серебро', icon: '🥈', price: 680, change24h: -1.2, totalInvested: 15000 },
    { type: 'realestate', name: 'Недвижимость', icon: '🏢', price: 12500000, change24h: 5.7, totalInvested: 50000 },
    { type: 'construction', name: 'Строительство', icon: '🏗️', price: 2300, change24h: 3.4, totalInvested: 18000 },
    { type: 'stocks', name: 'Акции', icon: '📈', price: 450, change24h: -0.8, totalInvested: 22000 },
    { type: 'crypto', name: 'Криптовалюта', icon: '₿', price: 68000, change24h: 8.2, totalInvested: 30000 },
  ]);

  const [investments, setInvestments] = useState<Investment[]>([
    { id: '1', type: 'gold', amount: 10000, date: '2024-01-15', currentValue: 11200, profit: 1200 },
    { id: '2', type: 'silver', amount: 5000, date: '2024-01-20', currentValue: 5400, profit: 400 },
    { id: '3', type: 'realestate', amount: 20000, date: '2024-02-01', currentValue: 23500, profit: 3500 },
  ]);

  const [selectedAsset, setSelectedAsset] = useState<AssetType>('gold');
  const [investAmount, setInvestAmount] = useState(1000);
  const [autoInvestEnabled, setAutoInvestEnabled] = useState(false);
  const [riskLevel, setRiskLevel] = useState<number[]>([50]);

  const [adminStats, setAdminStats] = useState({
    totalUsers: 1547,
    totalInvestments: 8934567,
    activeInvestments: 234,
    pendingWithdrawals: 12,
    platformFee: 89345,
  });

  const [notifications, setNotifications] = useState([
    { id: '1', text: 'Ваша инвестиция в золото выросла на 12%', time: '5 мин назад' },
    { id: '2', text: 'Доступен новый проект строительства', time: '1 час назад' },
    { id: '3', text: 'Выплата дивидендов зачислена', time: '3 часа назад' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => prev.map(asset => ({
        ...asset,
        price: asset.price * (1 + (Math.random() - 0.5) * 0.001),
        change24h: asset.change24h + (Math.random() - 0.5) * 0.2,
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleInvest = () => {
    if (investAmount > balance) {
      toast.error('Недостаточно средств!');
      return;
    }

    const asset = assets.find(a => a.type === selectedAsset);
    if (!asset) return;

    const newInvestment: Investment = {
      id: Date.now().toString(),
      type: selectedAsset,
      amount: investAmount,
      date: new Date().toISOString().split('T')[0],
      currentValue: investAmount,
      profit: 0,
    };

    setInvestments(prev => [...prev, newInvestment]);
    setBalance(prev => prev - investAmount);
    
    setAssets(prev => prev.map(a => 
      a.type === selectedAsset 
        ? { ...a, totalInvested: a.totalInvested + investAmount }
        : a
    ));

    toast.success(`Инвестировано ${investAmount}₽ в ${asset.name}!`);
  };

  const calculatePortfolioValue = () => {
    return investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h1 className="text-5xl font-black mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          💎 PREMIUM INVEST
        </h1>
        <p className="text-xl text-muted-foreground">Инвестируйте в будущее с умом</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="premium-card p-6 bg-gradient-to-br from-card to-card/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Баланс</span>
            <Icon name="Wallet" size={20} className="text-primary" />
          </div>
          <p className="text-3xl font-bold">{balance.toLocaleString()}₽</p>
          <p className="text-xs text-muted-foreground mt-1">Доступно для инвестиций</p>
        </Card>

        <Card className="premium-card p-6 bg-gradient-to-br from-card to-card/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Портфель</span>
            <Icon name="PieChart" size={20} className="text-accent" />
          </div>
          <p className="text-3xl font-bold">{calculatePortfolioValue().toLocaleString()}₽</p>
          <p className="text-xs text-muted-foreground mt-1">Общая стоимость</p>
        </Card>

        <Card className="premium-card p-6 bg-gradient-to-br from-card to-card/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Прибыль</span>
            <Icon name="TrendingUp" size={20} className="profit-text" />
          </div>
          <p className="text-3xl font-bold profit-text">+{totalProfit.toLocaleString()}₽</p>
          <p className="text-xs text-muted-foreground mt-1">За все время</p>
        </Card>

        <Card className="premium-card p-6 bg-gradient-to-br from-card to-card/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">ROI</span>
            <Icon name="Target" size={20} className="text-primary" />
          </div>
          <p className="text-3xl font-bold">+12.4%</p>
          <p className="text-xs text-muted-foreground mt-1">Доходность</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="premium-card p-6">
            <h3 className="text-xl font-bold mb-4">Активы</h3>
            <div className="space-y-3">
              {assets.map(asset => (
                <div key={asset.type} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{asset.icon}</div>
                    <div>
                      <p className="font-bold">{asset.name}</p>
                      <p className="text-sm text-muted-foreground">{asset.price.toLocaleString()}₽</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${asset.change24h >= 0 ? 'profit-text' : 'loss-text'}`}>
                      {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Инвестировано: {asset.totalInvested.toLocaleString()}₽</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="premium-card p-6">
            <h3 className="text-xl font-bold mb-4">График доходности</h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {[65, 72, 68, 85, 78, 92, 88, 95, 102, 98, 110, 115].map((value, idx) => (
                <div key={idx} className="flex-1 bg-gradient-to-t from-primary/50 to-primary rounded-t" style={{ height: `${value}%` }}></div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Янв</span>
              <span>Фев</span>
              <span>Мар</span>
              <span>Апр</span>
              <span>Май</span>
              <span>Июн</span>
              <span>Июл</span>
              <span>Авг</span>
              <span>Сен</span>
              <span>Окт</span>
              <span>Ноя</span>
              <span>Дек</span>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="premium-card p-6">
            <h3 className="text-xl font-bold mb-4">Быстрые действия</h3>
            <div className="space-y-3">
              <Button className="w-full gold-gradient text-black font-bold" onClick={() => setCurrentSection('invest')}>
                <Icon name="Plus" size={18} className="mr-2" />
                Инвестировать
              </Button>
              <Button variant="outline" className="w-full">
                <Icon name="ArrowDown" size={18} className="mr-2" />
                Вывести средства
              </Button>
              <Button variant="outline" className="w-full">
                <Icon name="RefreshCw" size={18} className="mr-2" />
                Реинвестировать
              </Button>
            </div>
          </Card>

          <Card className="premium-card p-6">
            <h3 className="text-xl font-bold mb-4">Уведомления</h3>
            <ScrollArea className="h-48">
              <div className="space-y-3">
                {notifications.map(notif => (
                  <div key={notif.id} className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm">{notif.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderInvest = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold">Инвестировать</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {assets.map(asset => (
          <Card 
            key={asset.type}
            className={`premium-card p-6 cursor-pointer ${selectedAsset === asset.type ? 'border-primary border-2' : ''}`}
            onClick={() => setSelectedAsset(asset.type)}
          >
            <div className="text-center">
              <div className="text-5xl mb-2">{asset.icon}</div>
              <h3 className="font-bold">{asset.name}</h3>
              <p className="text-sm text-muted-foreground">{asset.price.toLocaleString()}₽</p>
              <p className={`text-sm font-bold mt-2 ${asset.change24h >= 0 ? 'profit-text' : 'loss-text'}`}>
                {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
              </p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="premium-card p-6">
        <h3 className="text-xl font-bold mb-6">Параметры инвестиции</h3>
        
        <div className="space-y-6">
          <div>
            <Label>Сумма инвестиции</Label>
            <Input 
              type="number"
              value={investAmount}
              onChange={(e) => setInvestAmount(Number(e.target.value))}
              className="mt-2"
            />
            <div className="flex gap-2 mt-2">
              {[1000, 5000, 10000, 50000].map(amount => (
                <Button key={amount} variant="outline" size="sm" onClick={() => setInvestAmount(amount)}>
                  {amount.toLocaleString()}₽
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label>Уровень риска</Label>
            <Slider 
              value={riskLevel}
              onValueChange={setRiskLevel}
              max={100}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Низкий</span>
              <span>Средний</span>
              <span>Высокий</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Автоинвестирование</Label>
              <p className="text-xs text-muted-foreground">Автоматически реинвестировать прибыль</p>
            </div>
            <Switch checked={autoInvestEnabled} onCheckedChange={setAutoInvestEnabled} />
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Ожидаемая доходность:</span>
              <span className="font-bold profit-text">+{(investAmount * 0.15).toLocaleString()}₽</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Комиссия:</span>
              <span className="font-bold">{(investAmount * 0.02).toLocaleString()}₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Итого к инвестированию:</span>
              <span className="font-bold text-xl">{investAmount.toLocaleString()}₽</span>
            </div>
          </div>

          <Button className="w-full gold-gradient text-black font-bold text-lg py-6" onClick={handleInvest}>
            Инвестировать сейчас
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderPortfolio = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Мой портфель</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="premium-card p-4">
          <p className="text-sm text-muted-foreground">Активных инвестиций</p>
          <p className="text-3xl font-bold">{investments.length}</p>
        </Card>
        <Card className="premium-card p-4">
          <p className="text-sm text-muted-foreground">Общая стоимость</p>
          <p className="text-3xl font-bold">{calculatePortfolioValue().toLocaleString()}₽</p>
        </Card>
        <Card className="premium-card p-4">
          <p className="text-sm text-muted-foreground">Прибыль</p>
          <p className="text-3xl font-bold profit-text">+{totalProfit.toLocaleString()}₽</p>
        </Card>
        <Card className="premium-card p-4">
          <p className="text-sm text-muted-foreground">Средняя доходность</p>
          <p className="text-3xl font-bold">+14.2%</p>
        </Card>
      </div>

      <Card className="premium-card p-6">
        <h3 className="text-xl font-bold mb-4">Активные инвестиции</h3>
        <div className="space-y-3">
          {investments.map(inv => {
            const asset = assets.find(a => a.type === inv.type);
            return (
              <div key={inv.id} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{asset?.icon}</span>
                    <div>
                      <p className="font-bold">{asset?.name}</p>
                      <p className="text-sm text-muted-foreground">Дата: {inv.date}</p>
                    </div>
                  </div>
                  <Badge className="profit-text border-accent">Активна</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Инвестировано</p>
                    <p className="font-bold">{inv.amount.toLocaleString()}₽</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Текущая стоимость</p>
                    <p className="font-bold">{inv.currentValue.toLocaleString()}₽</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Прибыль</p>
                    <p className="font-bold profit-text">+{inv.profit.toLocaleString()}₽</p>
                  </div>
                </div>
                <Progress value={(inv.profit / inv.amount) * 100} className="mt-3" />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );

  const renderAdmin = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Админ-панель</h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="premium-card p-4 bg-gradient-to-br from-primary/10 to-primary/5">
          <p className="text-sm text-muted-foreground">Пользователей</p>
          <p className="text-3xl font-bold">{adminStats.totalUsers.toLocaleString()}</p>
        </Card>
        <Card className="premium-card p-4 bg-gradient-to-br from-accent/10 to-accent/5">
          <p className="text-sm text-muted-foreground">Инвестиций</p>
          <p className="text-3xl font-bold">{adminStats.totalInvestments.toLocaleString()}₽</p>
        </Card>
        <Card className="premium-card p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
          <p className="text-sm text-muted-foreground">Активных</p>
          <p className="text-3xl font-bold">{adminStats.activeInvestments}</p>
        </Card>
        <Card className="premium-card p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5">
          <p className="text-sm text-muted-foreground">Выводов</p>
          <p className="text-3xl font-bold">{adminStats.pendingWithdrawals}</p>
        </Card>
        <Card className="premium-card p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
          <p className="text-sm text-muted-foreground">Комиссия</p>
          <p className="text-3xl font-bold">{adminStats.platformFee.toLocaleString()}₽</p>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="investments">Инвестиции</TabsTrigger>
          <TabsTrigger value="assets">Активы</TabsTrigger>
          <TabsTrigger value="transactions">Транзакции</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card className="premium-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Управление пользователями</h3>
              <Button size="sm">
                <Icon name="UserPlus" size={16} className="mr-2" />
                Добавить
              </Button>
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-bold">Пользователь_{i}234</p>
                    <p className="text-sm text-muted-foreground">user{i}@example.com</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Просмотр</Button>
                    <Button size="sm" variant="outline">Заблокировать</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="investments">
          <Card className="premium-card p-6">
            <h3 className="text-xl font-bold mb-4">Все инвестиции</h3>
            <p className="text-muted-foreground">Общий объем: {adminStats.totalInvestments.toLocaleString()}₽</p>
          </Card>
        </TabsContent>

        <TabsContent value="assets">
          <Card className="premium-card p-6">
            <h3 className="text-xl font-bold mb-4">Управление активами</h3>
            <div className="space-y-3">
              {assets.map(asset => (
                <div key={asset.type} className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{asset.icon}</span>
                    <div>
                      <p className="font-bold">{asset.name}</p>
                      <p className="text-sm text-muted-foreground">Цена: {asset.price.toLocaleString()}₽</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Изменить</Button>
                    <Button size="sm" variant="outline">Отключить</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="premium-card p-6">
            <h3 className="text-xl font-bold mb-4">Последние транзакции</h3>
            <p className="text-muted-foreground">Здесь отображаются все транзакции платформы</p>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="premium-card p-6">
            <h3 className="text-xl font-bold mb-4">Настройки платформы</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Комиссия платформы</Label>
                  <p className="text-sm text-muted-foreground">Текущая: 2%</p>
                </div>
                <Input type="number" className="w-24" defaultValue={2} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Минимальная инвестиция</Label>
                  <p className="text-sm text-muted-foreground">Текущая: 1000₽</p>
                </div>
                <Input type="number" className="w-32" defaultValue={1000} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Автоматическое одобрение выводов</Label>
                <Switch />
              </div>
              <Button className="w-full">Сохранить настройки</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard': return renderDashboard();
      case 'invest': return renderInvest();
      case 'portfolio': return renderPortfolio();
      case 'admin': return renderAdmin();
      default: return (
        <Card className="premium-card p-12 text-center">
          <h2 className="text-2xl font-bold mb-2">Раздел в разработке</h2>
          <p className="text-muted-foreground">Этот функционал скоро будет доступен</p>
        </Card>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: 'Inter, sans-serif' }}>
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <h1 
                className="text-2xl font-black gold-gradient bg-clip-text text-transparent cursor-pointer"
                style={{ fontFamily: 'Playfair Display, serif' }}
                onClick={() => setCurrentSection('dashboard')}
              >
                💎 PREMIUM INVEST
              </h1>
              
              <nav className="hidden lg:flex gap-1">
                <Button variant="ghost" onClick={() => setCurrentSection('dashboard')}>
                  <Icon name="LayoutDashboard" size={18} className="mr-2" />
                  Дашборд
                </Button>
                <Button variant="ghost" onClick={() => setCurrentSection('portfolio')}>
                  <Icon name="Briefcase" size={18} className="mr-2" />
                  Портфель
                </Button>
                <Button variant="ghost" onClick={() => setCurrentSection('invest')}>
                  <Icon name="TrendingUp" size={18} className="mr-2" />
                  Инвестировать
                </Button>
                <Button variant="ghost" onClick={() => setCurrentSection('analytics')}>
                  <Icon name="BarChart3" size={18} className="mr-2" />
                  Аналитика
                </Button>
                <Button variant="ghost" onClick={() => setCurrentSection('transactions')}>
                  <Icon name="Receipt" size={18} className="mr-2" />
                  Транзакции
                </Button>
                <Button variant="ghost" onClick={() => setCurrentSection('settings')}>
                  <Icon name="Settings" size={18} className="mr-2" />
                  Настройки
                </Button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="gold-gradient px-6 py-2 rounded-lg font-bold text-black">
                {balance.toLocaleString()}₽
              </div>

              <Button variant="outline">
                <Icon name="Bell" size={18} />
              </Button>

              {isAdmin && (
                <Button variant="outline" onClick={() => setCurrentSection('admin')}>
                  <Icon name="Shield" size={18} className="mr-2" />
                  Админ
                </Button>
              )}

              <Button variant="outline">
                <Icon name="User" size={18} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {renderSection()}
      </main>

      <footer className="border-t border-border mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 Premium Invest. Инвестиции с гарантией безопасности.</p>
        </div>
      </footer>
    </div>
  );
}
