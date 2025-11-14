import React, { useState, useEffect } from "react"
import { MapPin, Wind, AlertTriangle, Loader, ChevronLeft, ChevronRight, Tornado } from "lucide-react"

const API_BASE_URL = "http://localhost:8000"

// ============================================
// NUEVO: Popup para mostrar JSON (con
//        manejo de carga y error)
// ============================================
function InfoPopup({ isOpen, onClose, title, content, isLoading, error }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-[#024b58] text-[#EAF6F6] rounded-xl p-6 w-[90%] max-w-lg shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-3">{title}</h2>
        
        {/* Contenido del Popup */}
        <div className="bg-black/30 p-3 rounded-lg overflow-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
          ) : error ? (
            <pre className="text-xs text-red-400 whitespace-pre-wrap">
              Error al cargar datos: {error}
            </pre>
          ) : (
            <pre className="text-xs text-[#B2D8D8] whitespace-pre-wrap">
              {content ? JSON.stringify(content, null, 2) : "No hay datos disponibles."}
            </pre>
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-cyan-300 hover:text-cyan-100 text-xl font-bold w-8 h-8 flex items-center justify-center"
        >
          ✖
        </button>
      </div>
    </div>
  )
}

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

  // EFECTO 1: Cuando el array de imágenes cambia, resetea el carrusel
  useEffect(() => {
    setImageLoading(true)
    // Reset index if images array changes
    setCurrentIndex(0)
  }, [images])

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
      <div className="relative bg-[#013f4e] rounded-lg overflow-hidden min-h-[250px] md:min-h-[400px] flex items-center justify-center">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#013f4e] z-10">
            <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        )}

        <img
          key={images[currentIndex]} // <!-- ✨ ¡ESTA ES LA MAGIA! ✨
          src={images[currentIndex]}
          alt={`${title} - Imagen ${currentIndex + 1}`}
          className="w-full h-auto max-h-[600px] object-contain"
          onLoad={() => setImageLoading(false)}
          onError={(e) => {
            console.error(`Error cargando imagen ${currentIndex}:`, images[currentIndex])
            setImageLoading(false)
          }}
        />

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

        {/* Indicador de posición solo si hay imágenes */}
        {images.length > 0 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 px-4 py-2 rounded-full z-20">
            <span className="text-white text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        )}
      </div>

      {images.length > 1 && images.length <= 10 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 justify-center">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx)
                setImageLoading(true)
              }}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${idx === currentIndex
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

      {images.length > 10 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 justify-center">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx)
                setImageLoading(true)
              }}
              className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex
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
// Carrusel General (PARA HISTÓRICO)
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
        setImages([])

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
// Carrusel de Tormenta (HÍBRIDO: Histórico Y Última Lectura)
// ============================================
function StormMapCarousel({ stormId, latestDate }) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!stormId) return

    const loadStormMaps = async () => {
      try {
        setLoading(true)
        setError(null)
        setImages([])

        if (latestDate) {
          console.log(`📅 HISTÓRICO: Cargando mapas para tormenta: ${stormId}, fecha: ${latestDate}`)

          const listResponse = await fetch(`${API_BASE_URL}/api/date/${latestDate}/maps/${stormId}/list`)

          if (!listResponse.ok) {
            throw new Error(`No se pudieron cargar las imágenes de ${stormId}`)
          }

          const listData = await listResponse.json()
          console.log(`Lista de mapas para ${stormId}:`, listData)

          const imageUrls = listData.images.map(img =>
            `${API_BASE_URL}/api/date/${latestDate}/maps/${stormId}/${img.index}?v=${latestDate}`
          )

          console.log(`✅ ${imageUrls.length} imágenes de ${stormId} cargadas`)
          setImages(imageUrls)
        } else {
          console.log(`🕐 ÚLTIMA LECTURA: Cargando última imagen para tormenta: ${stormId}`)

          const checkResponse = await fetch(`${API_BASE_URL}/api/maps/${stormId}`, { cache: 'no-store' })

          if (!checkResponse.ok) {
            throw new Error(`No se encontró mapa para ${stormId}`)
          }

          const imageUrl = `${API_BASE_URL}/api/maps/${stormId}?v=${Date.now()}`
          console.log(`✅ 1 imagen de ${stormId} cargada (última lectura)`)
          setImages([imageUrl])
        }

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

// ============================================
// Última Imagen General Disponible
// ============================================
function LatestAvailableGeneral() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageUrl, setImageUrl] = useState(null)

  useEffect(() => {
    let isMounted = true
    const checkLatest = async () => {
      try {
        setLoading(true)
        setError(null)
        setImageLoading(true)

        const resp = await fetch(`${API_BASE_URL}/api/maps`, { cache: 'no-store' })
        if (!resp.ok) {
          throw new Error('No se encontró el mapa general más reciente')
        }

        if (isMounted) setImageUrl(`${API_BASE_URL}/api/maps?v=${Date.now()}`)
      } catch (err) {
        console.error('Error obteniendo el último mapa general:', err)
        if (isMounted) setError(err.message || 'Error al obtener el mapa')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    checkLatest()
    return () => { isMounted = false }
  }, [])

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

  if (!imageUrl) {
    return (
      <div className="text-center py-8">
        <MapPin className="w-12 h-12 text-slate-500 mx-auto mb-2 opacity-30" />
        <p className="text-[#B2D8D8]">No hay mapa disponible</p>
      </div>
    )
  }

  return (
    <div className="relative bg-[#013f4e] rounded-lg overflow-hidden min-h-[250px] md:min-h-[400px] flex items-center justify-center">
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#013f4e] z-10">
          <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      )}

      <img
        src={imageUrl}
        alt="Mapa General - Último"
        className="w-full h-auto max-h-[600px] object-contain"
        onLoad={() => setImageLoading(false)}
        onError={(e) => {
          console.error('Error cargando el último mapa general', e)
          setImageLoading(false)
        }}
      />
    </div>
  )
}

// ============================================
// DashboardContent Principal
// ============================================
export default function DashboardContent({ mainStormView, setMainStormView, activeStorms = [], loading, error, latestDate }) {
  const [showInfo, setShowInfo] = useState(false)
  const [popupTitle, setPopupTitle] = useState("Datos JSON")
  const [popupContent, setPopupContent] = useState(null)
  const [isPopupLoading, setIsPopupLoading] = useState(false)
  const [popupError, setPopupError] = useState(null)

  const getDangerLevelColor = (category) => {
    if (category >= 4) return "bg-red-500"
    if (category >= 2) return "bg-yellow-500"
    return "bg-green-500"
  }

  // --- NUEVA FUNCIÓN ---
  // Limpia el estado del popup y lo cierra
  const closePopup = () => {
    setShowInfo(false)
    setPopupContent(null)
    setPopupError(null)
    setIsPopupLoading(false)
  }

  // --- NUEVA FUNCIÓN ---
  // Maneja el click en los botones JSON del MODO HISTÓRICO
  const handleHistoricJsonClick = async (storm = null) => {
    // 1. Mostrar el popup en modo "Cargando"
    setShowInfo(true)
    setIsPopupLoading(true)
    setPopupError(null)
    setPopupContent(null)

    let url = ""
    if (storm) {
      // Es una tormenta específica
      setPopupTitle(`Datos JSON: ${storm.nombre || storm.id}`)
      url = `${API_BASE_URL}/api/date/${latestDate}/storms/${storm.id}`
    } else {
      // Es la vista general
      setPopupTitle(`Datos JSON: Vista General (${latestDate})`)
      url = `${API_BASE_URL}/api/date/${latestDate}/storms`
    }

    // 2. Hacer el fetch
    try {
      const response = await fetch(url)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `Error ${response.status}`)
      }
      const data = await response.json()
      
      // 3. Mostrar los datos
      setPopupContent(data)
      
    } catch (err) {
      // 4. Mostrar el error
      console.error("Error fetching JSON:", err)
      setPopupError(err.message)
    } finally {
      // 5. Dejar de cargar
      setIsPopupLoading(false)
    }
  }


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

  // VISTA #1: ÚLTIMA LECTURA (sin fecha seleccionada)
  // (Los botones JSON aquí siguen siendo HARDCODED)
  if (!latestDate) {
    return (
      <section className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#013f4e]">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#EAF6F6] mb-2 drop-shadow-lg">
            {mainStormView ? mainStormView.nombre || mainStormView.name : "Última Lectura General"}
          </h1>
          <p className="text-[#B2D8D8] text-sm">
            {mainStormView ? `ID: ${mainStormView.id}` : "Mostrando el mapa general y tormentas más recientes."}
          </p>
        </div>
        
        {/* --- INICIO DE LA CORRECCIÓN --- */}
        {/* Este grid ahora SIEMPRE es visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => setMainStormView(null)}
            className={`bg-[#024b58]/80 backdrop-blur-xl rounded-[14px] border transition-all duration-300 overflow-hidden text-left group hover:scale-[1.02] ${!mainStormView
                ? "border-cyan-400/40 shadow-lg shadow-cyan-400/25"
                : "border-white/10 hover:border-cyan-400/30 shadow-lg hover:shadow-cyan-400/15"
              }`}
          >
            <div className="h-1 bg-gradient-to-r from-green-500/50 to-emerald-500/50" />
            <div className="relative aspect-[4/3] flex items-center justify-center">
              <Tornado className="w-12 h-12 text-cyan-400 opacity-50" />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-bold text-[#EAF6F6] group-hover:text-cyan-300 transition-colors">
                Vista General
              </h3>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    const res = await fetch("http://localhost:8000/api/storms");
                    const data = await res.json();

                    setPopupTitle("Datos JSON - Vista General");
                    setPopupContent(data);
                    setShowInfo(true);
                  } catch (error) {
                    console.error(error);
                    setPopupTitle("Error al cargar JSON");
                    setPopupContent({ error: "No se pudo obtener el JSON general." });
                    setShowInfo(true);
                  }
                }}
                className="mt-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-2 py-1 rounded-lg text-xs transition-all"
              >
                JSON
              </button>
            </div>
          </button>

          {/* Mapeamos las tormentas aquí */}
          {activeStorms.map((storm) => {
            const isSelected = mainStormView?.id === storm.id
            const category = storm.categoria || storm.category || 1
            const dangerColor = getDangerLevelColor(category)
            return (
              <button
                key={storm.id}
                onClick={() => setMainStormView(storm)}
                className={`bg-[#024b58]/80 rounded-[14px] border transition-all duration-300 overflow-hidden text-left group hover:scale-[1.02] ${isSelected
                    ? "border-cyan-400/40 shadow-lg shadow-cyan-400/25"
                    : "border-white/10 hover:border-cyan-400/30 shadow-lg hover:shadow-cyan-400/15"
                  }`}
              >
                <div className={`h-1 ${dangerColor}`} />
                <div className="relative aspect-[4/3] flex items-center justify-center bg-[#013f4e]">
                  {storm.imageUrl && !storm.invest ? (
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
                  <div className={storm.imageUrl && !storm.invest ? "hidden" : "flex"} style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
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
                  <button
                    onClick={async (e) => {
                      e.stopPropagation()
                      try {
                        const res = await fetch(`http://localhost:8000/api/storms/${storm.id}`)
                        const data = await res.json()

                        setPopupTitle(`Datos JSON - Tormenta ${storm.id}`)
                        setPopupContent(data)
                        setShowInfo(true)
                      } catch (error) {
                        console.error(error)
                        setPopupTitle("Error al cargar JSON")
                        setPopupContent({ error: `No se pudo obtener el JSON de la tormenta ${storm.id}.` })
                        setShowInfo(true)
                      }
                    }}
                    className="mt-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-2 py-1 rounded-lg text-xs transition-all"
                  >
                    JSON
                  </button>
                </div>
              </button>
            )
          })}
        </div>

        {/* El mensaje de "No hay tormentas" solo aparece si es 0 */}
        {activeStorms.length === 0 && (
          <div className="bg-[#024b58]/80 backdrop-blur-xl rounded-[14px] border border-white/10 p-12 text-center mb-6">
            <Wind className="w-16 h-16 text-slate-500 mx-auto mb-4 opacity-30" />
            <h3 className="text-xl font-bold text-[#EAF6F6] mb-2">No hay tormentas activas</h3>
            <p className="text-[#B2D8D8]">No se detectan tormentas tropicales en la última lectura.</p>
          </div>
        )}

        {/* El carrusel ahora va después y SIEMPRE es visible */}
        <div className="bg-[#024b58]/80 backdrop-blur-xl rounded-[14px] border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-[#EAF6F6]">
              {
                !mainStormView
                  ? "Mapa General (Última Lectura)"
                  : mainStormView.invest
                    ? `Área de Investigación: ${mainStormView.nombre || mainStormView.name}`
                    : `Mapa de ${mainStormView.nombre || mainStormView.name} (Última Lectura)`
              }
            </h2>
          </div>

          <div className="p-4">
            {
              !mainStormView ? (
                <LatestAvailableGeneral />
              )
                : mainStormView.invest ? (
                  <div className="text-center py-8">
                    <Wind className="w-12 h-12 text-slate-500 mx-auto mb-2 opacity-30" />
                    <h3 className="text-lg font-bold text-[#EAF6F6]">Investigación Activa</h3>
                    <p className="text-[#B2D8D8]">No hay mapas individuales para esta área.</p>
                  </div>
                )
                  : (
                    <StormMapCarousel
                      stormId={mainStormView.id}
                      latestDate={null}
                    />
                  )
            }
          </div>
        </div>
        {/* --- FIN DE LA CORRECCIÓN --- */}

        {/* El Popup para la VISTA #1 */}
        <InfoPopup
          isOpen={showInfo}
          onClose={closePopup}
          title={popupTitle}
          content={popupContent}
          isLoading={isPopupLoading} // Siempre será false aquí
          error={popupError}       // Siempre será null aquí
        />
      </section>
    )
  }

  // VISTA #2: HISTÓRICO (con fecha seleccionada)
  // (Los botones JSON aquí SÍ HACEN FETCH)
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

      {/* --- INICIO DE LA CORRECCIÓN --- */}
      {/* Este grid ahora SIEMPRE es visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => setMainStormView(null)}
          className={`bg-[#024b58]/80 backdrop-blur-xl rounded-[14px] border transition-all duration-300 overflow-hidden text-left group hover:scale-[1.02] ${!mainStormView
              ? "border-cyan-400/40 shadow-lg shadow-cyan-400/25"
              : "border-white/10 hover:border-cyan-400/30 shadow-lg hover:shadow-cyan-400/15"
            }`}
        >
          <div className="h-1 bg-gradient-to-r from-green-500/50 to-emerald-500/50" />
          <div className="relative aspect-[4/3] flex items-center justify-center">
            <Tornado className="w-12 h-12 text-cyan-400 opacity-50" />
          </div>
          <div className="p-3">
            <h3 className="text-sm font-bold text-[#EAF6F6] group-hover:text-cyan-300 transition-colors">
              Vista General
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation()
                // (Histórico) - HACE FETCH
                handleHistoricJsonClick(null)
              }}
              className="mt-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-2 py-1 rounded-lg text-xs transition-all"
            >
              JSON
            </button>
          </div>
        </button>

        {/* Mapeamos las tormentas (si hay) */}
        {activeStorms.map((storm) => {
          const isSelected = mainStormView?.id === storm.id
          const category = storm.categoria || storm.category || 1
          const dangerColor = getDangerLevelColor(category)

          return (
            <button
              key={storm.id}
              onClick={() => setMainStormView(storm)}
              className={`bg-[#024b58]/80 rounded-[14px] border transition-all duration-300 overflow-hidden text-left group hover:scale-[1.02] ${isSelected
                  ? "border-cyan-400/40 shadow-lg shadow-cyan-400/25"
                  : "border-white/10 hover:border-cyan-400/30 shadow-lg hover:shadow-cyan-400/15"
                }`}
            >
              <div className={`h-1 ${dangerColor}`} />
              <div className="relative aspect-[4/3] flex items-center justify-center bg-[#013f4e]">
                {storm.imageUrl && !storm.invest ? (
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

                <div className={storm.imageUrl && !storm.invest ? "hidden" : "flex"} style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
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
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // (Histórico) - HACE FETCH
                    handleHistoricJsonClick(storm)
                  }}
                  className="mt-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-2 py-1 rounded-lg text-xs transition-all"
                >
                  JSON
                </button>
              </div>
            </button>
          )
        })}
      </div>

      {/* El mensaje de "No hay tormentas" solo aparece si es 0 */}
      {activeStorms.length === 0 && (
        <div className="bg-[#024b58]/80 backdrop-blur-xl rounded-[14px] border border-white/10 p-12 text-center mb-6">
          <Wind className="w-16 h-16 text-slate-500 mx-auto mb-4 opacity-30" />
          <h3 className="text-xl font-bold text-[#EAF6F6] mb-2">No hay tormentas activas</h3>
          <p className="text-[#B2D8D8]">No se detectan tormentas tropicales para la fecha seleccionada.</p>
        </div>
      )}
      {/* --- FIN DE LA CORRECCIÓN --- */}


      <div className="bg-[#024b58]/80 backdrop-blur-xl rounded-[14px] border border-white/10 overflow-hidden mt-6">
        <div className="p-4 border-b border-white/10">
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

      {/* El Popup para la VISTA #2 */}
      <InfoPopup
        isOpen={showInfo}
        onClose={closePopup}
        title={popupTitle}
        content={popupContent}
        isLoading={isPopupLoading}
        error={popupError}
      />
    </section>
  )
}