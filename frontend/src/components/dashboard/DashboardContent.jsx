import React, { useState, useEffect } from "react"
import { MapPin, Wind, AlertTriangle, Loader, ChevronLeft, ChevronRight } from "lucide-react"

const API_BASE_URL = "http://localhost:8000"

// ============================================
// Componente de Carrusel de Imágenes
// ============================================
function ImageCarousel({ images, title }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageLoading, setImageLoading] = useState(true)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setImageLoading(true)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setImageLoading(true)
  }

  useEffect(() => {
    setImageLoading(true)
  }, [currentIndex])

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-8">
        <MapPin className="w-12 h-12 text-slate-500 mx-auto mb-2 opacity-30" />
        <p className="text-[#B2D8D8]">No hay imágenes disponibles</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Imagen actual */}
      <div className="relative bg-[#013f4e] rounded-lg overflow-hidden min-h-[400px] flex items-center justify-center">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#013f4e] z-10">
            <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        )}
        
        <img 
          src={images[currentIndex]}
          alt={`${title} - Imagen ${currentIndex + 1}`}
          className="w-full h-auto max-h-[600px] object-contain"
          onLoad={() => setImageLoading(false)}
          onError={(e) => {
            console.error(`Error cargando imagen ${currentIndex}:`, images[currentIndex])
            setImageLoading(false)
          }}
        />

        {/* Botones de navegación */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all z-20 hover:scale-110"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all z-20 hover:scale-110"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Indicador de posición */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 px-4 py-2 rounded-full z-20">
          <span className="text-white text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* Miniaturas */}
      {images.length > 1 && images.length <= 10 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 justify-center">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx)
                setImageLoading(true)
              }}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentIndex 
                  ? "border-cyan-400 scale-110 shadow-lg shadow-cyan-400/50" 
                  : "border-white/20 opacity-60 hover:opacity-100 hover:border-cyan-400/50"
              }`}
            >
              <img 
                src={img} 
                alt={`Miniatura ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy" 
              />
            </button>
          ))}
        </div>
      )}

      {/* Lista de puntos para más de 10 imágenes */}
      {images.length > 10 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 justify-center">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx)
                setImageLoading(true)
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentIndex 
                  ? "bg-cyan-400 scale-125" 
                  : "bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Ir a imagen ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// Componente para cargar imágenes generales
// ============================================
function GeneralMapCarousel({ latestDate }) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!latestDate) return

    const loadGeneralMaps = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log(`Cargando mapas generales para fecha: ${latestDate}`)
        
        const listResponse = await fetch(`${API_BASE_URL}/api/date/${latestDate}/maps/general/list`)
        
        if (!listResponse.ok) {
          throw new Error('No se pudieron cargar las imágenes generales')
        }
        
        const listData = await listResponse.json()
        console.log("Lista de mapas generales:", listData)
        
        const imageUrls = listData.images.map(img => 
          `${API_BASE_URL}/api/date/${latestDate}/maps/general/${img.index}?v=${latestDate}`
        )
        
        console.log(`${imageUrls.length} imágenes generales cargadas`)
        setImages(imageUrls)
        
      } catch (err) {
        console.error('Error cargando mapas generales:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadGeneralMaps()
  }, [latestDate])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-2" />
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  return <ImageCarousel images={images} title="Mapa General" />
}

// ============================================
// Componente para cargar imágenes de tormenta específica
// ============================================
function StormMapCarousel({ stormId, latestDate }) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!stormId || !latestDate) return

    const loadStormMaps = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log(`Cargando mapas para tormenta: ${stormId}, fecha: ${latestDate}`)
        
        const listResponse = await fetch(`${API_BASE_URL}/api/date/${latestDate}/maps/${stormId}/list`)
        
        if (!listResponse.ok) {
          throw new Error(`No se pudieron cargar las imágenes de ${stormId}`)
        }
        
        const listData = await listResponse.json()
        console.log(`Lista de mapas para ${stormId}:`, listData)
        
        const imageUrls = listData.images.map(img => 
          `${API_BASE_URL}/api/date/${latestDate}/maps/${stormId}/${img.index}?v=${latestDate}`
        )
        
        console.log(`${imageUrls.length} imágenes de ${stormId} cargadas`)
        setImages(imageUrls)
        
      } catch (err) {
        console.error(`Error cargando mapas de ${stormId}:`, err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadStormMaps()
  }, [stormId, latestDate])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-2" />
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  return <ImageCarousel images={images} title={`Tormenta ${stormId}`} />
}


export default function DashboardContent({ mainStormView, setMainStormView, activeStorms, loading, error, latestDate }) {
  const getDangerLevelColor = (category) => {
    if (category >= 4) return "bg-red-500"
    if (category >= 2) return "bg-yellow-500"
    return "bg-green-500"
  }

  // Muestra el spinner si está cargando
  if (loading) {
    return (
      <section className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#013f4e] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-[#B2D8D8]">Cargando datos de tormentas...</p>
        </div>
      </section>
    )
  }

  // Muestra un error si la API falló 
  
  if (error) {
    return (
      <section className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#013f4e] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-2">Error al cargar datos</p>
          <p className="text-[#B2D8D8] text-sm">{error}</p>
        </div>
      </section>
    )
  }

  if (!latestDate) {
    return (
      <section className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#013f4e] flex items-center justify-center">
        <div className="text-center bg-[#024b58]/80 p-12 rounded-[14px] border border-white/10">
          <MapPin className="w-16 h-16 text-slate-500 mx-auto mb-4 opacity-30" />
          <h3 className="text-xl font-bold text-[#EAF6F6] mb-2">Selecciona una fecha</h3>
          <p className="text-[#B2D8D8]">Usa el calendario en la barra lateral para cargar los datos de tormentas de un día específico.</p>
        </div>
      </section>
    )
  }

 

  return (
    <section className="flex-1 overflow-y-auto hide-scrollbar p-6 md:p-8 bg-[#013f4e]">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#EAF6F6] mb-2 drop-shadow-lg">
          {mainStormView ? mainStormView.nombre || mainStormView.name : "Vista General de Tormentas"}
        </h1>
        <p className="text-[#B2D8D8] text-sm">
          {mainStormView 
            ? `${mainStormView.ubicacion || mainStormView.location || 'Sin ubicación'}`
            : "Monitoreo en tiempo real de tormentas tropicales"}
        </p>
        {latestDate && (
          <p className="text-[#B2D8D8] text-xs mt-1">
            Datos para la fecha: {latestDate}
          </p>
        )}
      </div>

      {/* Storm Cards */}
      {activeStorms.length === 0 ? (
        // --- VISTA DE "NO HAY TORMENTAS" ---
        // (Esto se activa si la API devuelve un array vacío para esa fecha)
        <div className="bg-[#024b58]/80 backdrop-blur-xl rounded-[14px] border border-white/10 p-12 text-center">
          <Wind className="w-16 h-16 text-slate-500 mx-auto mb-4 opacity-30" />
          <h3 className="text-xl font-bold text-[#EAF6F6] mb-2">No hay tormentas activas</h3>
          <p className="text-[#B2D8D8]">No se detectan tormentas tropicales para la fecha seleccionada.</p>
        </div>
      ) : (
        // --- VISTA DE "SI HAY TORMENTAS" ---
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => setMainStormView(null)}
              className={`bg-[#024b58]/80 backdrop-blur-xl rounded-[14px] border transition-all duration-300 overflow-hidden text-left group hover:scale-[1.02] ${
                !mainStormView
                  ? "border-cyan-400/40 shadow-lg shadow-cyan-400/25"
                  : "border-white/10 hover:border-cyan-400/30 shadow-lg hover:shadow-cyan-400/15"
              }`}
            >
              <div className="h-1 bg-gradient-to-r from-green-500/50 to-emerald-500/50" />
              <div className="relative aspect-[4/3] flex items-center justify-center">
                <MapPin className="w-12 h-12 text-cyan-400 opacity-50" />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold text-[#EAF6F6] group-hover:text-cyan-300 transition-colors">
                  Vista General
                </h3>
              </div>
            </button>

            {activeStorms.map((storm) => {
              const isSelected = mainStormView?.id === storm.id
              const category = storm.categoria || storm.category || 1
              const dangerColor = getDangerLevelColor(category)

              return (
                <button
                  key={storm.id}
                  onClick={() => setMainStormView(storm)}
                  className={`bg-[#024b58]/80 rounded-[14px] border transition-all duration-300 overflow-hidden text-left group hover:scale-[1.02] ${
                    isSelected
                      ? "border-cyan-400/40 shadow-lg shadow-cyan-400/25"
                      : "border-white/10 hover:border-cyan-400/30 shadow-lg hover:shadow-cyan-400/15"
                  }`}
                >
                  <div className={`h-1 ${dangerColor}`} />
                  <div className="relative aspect-[4/3] flex items-center justify-center bg-[#013f4e]">
                    {storm.imageUrl ? (
                      <img 
                        src={storm.imageUrl} 
                        alt={storm.nombre || storm.name}
                        className="w-full h-full object-cover"
                        loading="lazy" 
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div className={storm.imageUrl ? "hidden" : "flex"} style={{position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center'}}>
                      <Wind className="w-12 h-12 text-cyan-400 opacity-40" />
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-[#EAF6F6] group-hover:text-cyan-300 transition-colors">
                      {storm.nombre || storm.name || `Tormenta ${storm.id}`}
                    </h3>
                    <p className="text-xs text-[#B2D8D8] mt-1">
                      Categoría {category}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* CARRUSEL - Se muestra SIEMPRE */}
          <div className="bg-[#024b58]/80 backdrop-blur-xl rounded-[14px] border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              
              {/* --- Lógica para tormentas sin imagen individual (97L) --- */}
              <h2 className="text-xl font-bold text-[#EAF6F6]">
                {
                  !mainStormView 
                    ? "Mapas Generales de Tormentas"
                  : mainStormView.invest 
                    ? `Área de Investigación: ${mainStormView.nombre || mainStormView.name}`
                    : `Mapas de ${mainStormView.nombre || mainStormView.name}`
                }
              </h2>

              <p className="text-sm text-[#B2D8D8] mt-1">
                {mainStormView 
                  ? `ID: ${mainStormView.id}` 
                  : `Todas las actualizaciones del ${latestDate || 'día seleccionado'}`}
              </p>
            </div>

            <div className="p-4">
              {
                !mainStormView ? (
                  // (Vista General)
                  <GeneralMapCarousel latestDate={latestDate} />
                ) 
                
                : mainStormView.invest ? (
                 
                  <div className="text-center py-8">
                    <Wind className="w-12 h-12 text-slate-500 mx-auto mb-2 opacity-30" />
                    <h3 className="text-lg font-bold text-[#EAF6F6]">Investigación Activa</h3>
                    <p className="text-[#B2D8D8]">
                      No hay mapas de pronóstico individuales para esta área de investigación.
                    </p>
                  </div>
                ) 
                
                : (
                 
                  <StormMapCarousel 
                    stormId={mainStormView.id} 
                    latestDate={latestDate}
                  />
                )
              }
            </div>
          </div>
        </>
      )}
    </section>
  )
}