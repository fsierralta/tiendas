import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { dashboard, login, register } from '@/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Package, Store, ChevronLeft, ChevronRight, Star, ShoppingCart, TrendingUp, Users, Clock } from 'lucide-react';

interface Producto {
    id: number;
    name: string;
    marca: string;
    model: string;
    precio: number;
    precio2: number;
    cantidad: number;
    locale: string;
    categoria: string;
    ubicacion: string;
}

interface Locale {
    id: number;
    name: string;
    ciudad: string;
    estado: string;
}

interface PageProps {
    productosDestacados: Producto[];
    locales: Locale[];
    canRegister?: boolean;
}

export default function Welcome({
    canRegister = true,
    productosDestacados = [],
    locales = [],
}: PageProps) {
    const { auth } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocale, setSelectedLocale] = useState('');
    const [searchResults, setSearchResults] = useState<Producto[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

    // Carrusel configuration
    const productosPorSlide = 4;
    const totalSlides = Math.ceil(productosDestacados.length / productosPorSlide);

    // Auto-advance carrusel
    useEffect(() => {
        if (totalSlides <= 1) return;
        
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, 6000);
        return () => clearInterval(timer);
    }, [totalSlides]);

    // Búsqueda de productos con debounce mejorado
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(() => {
            performSearch();
        }, 400);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedLocale]);

    const performSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const params = new URLSearchParams({
                query: searchQuery.trim(),
                ...(selectedLocale && selectedLocale !== 'all' && { locale_id: selectedLocale }),
            });

            const response = await fetch(`/buscar-productos?${params}`);
            if (!response.ok) throw new Error('Error en la búsqueda');
            
            const data = await response.json();
            setSearchResults(data.productos || []);
            
            // Guardar en historial de búsqueda
            if (searchQuery.trim() && !searchHistory.includes(searchQuery.trim())) {
                setSearchHistory(prev => [searchQuery.trim(), ...prev.slice(0, 4)]);
            }
        } catch (error) {
            console.error('Error al buscar productos:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSlideChange = (index: number) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const getProductosEnSlide = () => {
        const start = currentSlide * productosPorSlide;
        return productosDestacados.slice(start, start + productosPorSlide);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-VE', {
            style: 'currency',
            currency: 'VES',
            minimumFractionDigits: 2,
        }).format(price);
    };

    const getStockBadgeVariant = (cantidad: number) => {
        if (cantidad > 20) return 'default';
        if (cantidad > 5) return 'secondary';
        return 'destructive';
    };

    const getStockText = (cantidad: number) => {
        if (cantidad > 20) return 'Buen stock';
        if (cantidad > 5) return 'Stock limitado';
        return 'Últimas unidades';
    };

    return (
        <>
            <Head title="Tiendas - Catálogo de Productos">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                {/* Header Navigation */}
                <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 dark:bg-gray-800/90 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-600 p-2 rounded-lg">
                                    <Store className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Tiendas</h1>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Catálogo de Productos</p>
                                </div>
                            </div>
                            
                            <nav className="flex items-center space-x-3">
                                {auth.user ? (
                                    <Link href={dashboard()}>
                                        <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
                                            Ir al Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={login()}>
                                            <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                                                Iniciar Sesión
                                            </Button>
                                        </Link>
                                        {canRegister && (
                                            <Link href={register()}>
                                                <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
                                                    Registrarse
                                                </Button>
                                            </Link>
                                        )}
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section con Buscador */}
                <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
                    <div className="relative max-w-7xl mx-auto text-center">
                        <div className="mb-8">
                            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                                Descubre Nuestros
                                <span className="text-blue-600"> Productos</span>
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                                Encuentra los mejores productos en nuestras tiendas. Busca por nombre, marca o modelo 
                                y descubre su disponibilidad en cada local con precios competitivos.
                            </p>
                        </div>
                        
                        {/* Buscador Principal Mejorado */}
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-xl p-8 dark:bg-gray-800 border border-gray-100">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <Input
                                                type="text"
                                                placeholder="Buscar productos por nombre, marca o modelo..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-12 h-14 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                        {/* Historial de búsqueda */}
                                        {searchHistory.length > 0 && !searchQuery && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <span className="text-xs text-gray-500">Búsquedas recientes:</span>
                                                {searchHistory.map((term, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setSearchQuery(term)}
                                                        className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-gray-600 transition-colors"
                                                    >
                                                        {term}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="lg:w-80">
                                        <Select value={selectedLocale} onValueChange={setSelectedLocale}>
                                            <SelectTrigger className="h-14 border-gray-200 focus:border-blue-500">
                                                <SelectValue placeholder="Todos los locales" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Todos los locales</SelectItem>
                                                {locales.map((locale) => (
                                                    <SelectItem key={locale.id} value={locale.id.toString()}>
                                                        📍 {locale.name} - {locale.ciudad}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Rápidas */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center dark:bg-gray-800/80">
                                <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {productosDestacados.length}+
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">Productos</div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center dark:bg-gray-800/80">
                                <Store className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {locales.length}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">Locales</div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center dark:bg-gray-800/80">
                                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">24/7</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">Servicio</div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center dark:bg-gray-800/80">
                                <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">99%</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">Satisfacción</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Resultados de Búsqueda */}
                {searchQuery && (
                    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
                        <div className="max-w-7xl mx-auto">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Resultados para: <span className="text-blue-600">"{searchQuery}"</span>
                                </h3>
                                {selectedLocale && selectedLocale !== 'all' && (
                                    <p className="text-gray-600 dark:text-gray-300">
                                        en {locales.find(l => l.id.toString() === selectedLocale)?.name}
                                    </p>
                                )}
                                {selectedLocale === 'all' && (
                                    <p className="text-gray-600 dark:text-gray-300">
                                        en todos los locales
                                    </p>
                                )}
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {searchResults.length} productos encontrados
                                </p>
                            </div>
                            
                            {isSearching ? (
                                <div className="text-center py-16">
                                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                    <p className="mt-4 text-gray-600 dark:text-gray-300">Buscando productos...</p>
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {searchResults.map((producto) => (
                                        <Card key={producto.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
                                            <CardHeader className="pb-4">
                                                <div className="flex justify-between items-start">
                                                    <CardTitle className="text-lg font-semibold line-clamp-2 text-gray-900 dark:text-white">
                                                        {producto.name}
                                                    </CardTitle>
                                                    <Badge variant={getStockBadgeVariant(producto.cantidad)} className="text-xs">
                                                        {getStockText(producto.cantidad)}
                                                    </Badge>
                                                </div>
                                                <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                                                    {producto.marca} {producto.model}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-2xl font-bold text-green-600">
                                                        {formatPrice(producto.precio)}
                                                    </span>
                                                    {producto.precio2 && producto.precio2 !== producto.precio && (
                                                        <span className="text-sm text-gray-500 line-through">
                                                            {formatPrice(producto.precio2)}
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className="space-y-3">
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                                                        <span className="font-medium">{producto.locale}</span>
                                                    </div>
                                                    
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                        <Package className="h-4 w-4 mr-2 text-green-500" />
                                                        {producto.categoria}
                                                    </div>
                                                    
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                        <Store className="h-4 w-4 mr-2 text-purple-500" />
                                                        {producto.ubicacion}
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600 dark:text-gray-300">Stock:</span>
                                                        <span className="font-semibold text-gray-900 dark:text-white">
                                                            {producto.cantidad} unidades
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-md">
                                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                                    Ver Detalles
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                        <Search className="h-12 w-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        No se encontraron productos
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                                        Intenta con otros términos de búsqueda o selecciona un local diferente.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Productos Destacados - Carrusel Mejorado */}
                {!searchQuery && productosDestacados.length > 0 && (
                    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-12">
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                    Productos Destacados
                                </h3>
                                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                    Los productos más populares y recomendados por nuestros clientes
                                </p>
                            </div>

                            <div className="relative">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {getProductosEnSlide().map((producto, index) => (
                                        <Card 
                                            key={producto.id} 
                                            className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-blue-100 dark:border-blue-900 shadow-lg"
                                        >
                                            <CardHeader className="pb-4">
                                                <div className="flex justify-between items-start">
                                                    <CardTitle className="text-lg font-semibold line-clamp-2 text-gray-900 dark:text-white">
                                                        {producto.name}
                                                    </CardTitle>
                                                    <div className="flex items-center space-x-1">
                                                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                        <span className="text-sm text-gray-600">4.5</span>
                                                    </div>
                                                </div>
                                                <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                                                    {producto.marca} {producto.model}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-2xl font-bold text-green-600">
                                                        {formatPrice(producto.precio)}
                                                    </span>
                                                    <Badge variant={getStockBadgeVariant(producto.cantidad)}>
                                                        Stock: {producto.cantidad}
                                                    </Badge>
                                                </div>
                                                
                                                <div className="space-y-3">
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                                                        <span className="font-medium">{producto.locale}</span>
                                                    </div>
                                                    
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                        <Package className="h-4 w-4 mr-2 text-green-500" />
                                                        {producto.categoria}
                                                    </div>
                                                    
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                        <Store className="h-4 w-4 mr-2 text-purple-500" />
                                                        {producto.ubicacion}
                                                    </div>
                                                </div>
                                                
                                                <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-md">
                                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                                    Ver Detalles
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Controles del Carrusel Mejorados */}
                                {totalSlides > 1 && (
                                    <>
                                        <button
                                            onClick={prevSlide}
                                            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all hover:scale-110"
                                        >
                                            <ChevronLeft className="h-6 w-6" />
                                        </button>
                                        <button
                                            onClick={nextSlide}
                                            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all hover:scale-110"
                                        >
                                            <ChevronRight className="h-6 w-6" />
                                        </button>
                                        
                                        {/* Indicadores Mejorados */}
                                        <div className="flex justify-center mt-8 space-x-3">
                                            {Array.from({ length: totalSlides }).map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleSlideChange(index)}
                                                    className={`h-3 rounded-full transition-all duration-300 ${
                                                        index === currentSlide
                                                            ? 'bg-blue-600 w-8'
                                                            : 'bg-gray-300 dark:bg-gray-600 w-3 hover:bg-gray-400'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer Mejorado */}
                <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="col-span-1 md:col-span-2">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="bg-blue-600 p-3 rounded-lg">
                                        <Store className="h-8 w-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">Tiendas</h3>
                                        <p className="text-gray-400">Sistema de Gestión</p>
                                    </div>
                                </div>
                                <p className="text-gray-400 leading-relaxed max-w-md">
                                    Tu sistema confiable para gestión de ventas e inventario. 
                                    Ofrecemos las mejores herramientas para administrar tu negocio 
                                    de manera eficiente y profesional.
                                </p>
                                <div className="flex space-x-4 mt-6">
                                    <div className="flex items-center text-sm text-gray-400">
                                        <Clock className="h-4 w-4 mr-2" />
                                        Lun-Sáb 8:00 AM - 6:00 PM
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-lg font-semibold mb-6">Enlaces Rápidos</h4>
                                <ul className="space-y-3">
                                    <li>
                                        <Link href="#" className="text-gray-400 hover:text-white transition-colors flex items-center">
                                            <span className="mr-2">🛍️</span> Catálogo de Productos
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-gray-400 hover:text-white transition-colors flex items-center">
                                            <span className="mr-2">📍</span> Nuestras Sucursales
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-gray-400 hover:text-white transition-colors flex items-center">
                                            <span className="mr-2">📞</span> Contacto
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-gray-400 hover:text-white transition-colors flex items-center">
                                            <span className="mr-2">❓</span> Ayuda
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="text-lg font-semibold mb-6">Contacto</h4>
                                <ul className="space-y-3 text-gray-400">
                                    <li className="flex items-center">
                                        <span className="mr-2">📧</span>
                                        info@tiendas.com
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2">📱</span>
                                        +58 123-4567890
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2">🌐</span>
                                        www.tiendas.com
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">📍</span>
                                        <span>
                                            Caracas, Venezuela<br />
                                            Edificio Central, Piso 5
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-800 mt-12 pt-8">
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <p className="text-gray-400 text-sm">
                                    &copy; 2024 Tiendas. Todos los derechos reservados.
                                </p>
                                <div className="flex space-x-6 mt-4 md:mt-0">
                                    <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                        Política de Privacidad
                                    </Link>
                                    <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                        Términos de Servicio
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
