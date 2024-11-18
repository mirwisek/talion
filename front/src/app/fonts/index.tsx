"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, RotateCw, Filter, BookOpen, Scale, GraduationCap, X, ZoomIn, ZoomOut, Download, Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

export default function RetroApp() {
  const [query, setQuery] = useState('')
  const [synonyms, setSynonyms] = useState({})
  const [loading, setLoading] = useState(false)
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [results, setResults] = useState(null)
  const [showFilters, setShowFilters] = useState(true)
  const [filters, setFilters] = useState({
    dateDebut: '',
    dateFin: '',
    juridiction: 'tous',
    typeDocument: 'tous',
    thematique: 'tous'
  })
  const [zoom, setZoom] = useState(1)
  const [darkMode, setDarkMode] = useState(false)
  const visualizationRef = useRef(null)

  // Génération de 50 points de données aléatoires avec connexions
  const generateMockResults = () => {
    const types = ['jurisprudence', 'code', 'doctrine']
    const sources = ['Cour de cassation', 'Conseil d\'État', 'Codes', 'Revue', 'Doctrine']
    const themes = ['Civil', 'Pénal', 'Commercial', 'Social', 'Administratif']
    
    const results = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      type: types[Math.floor(Math.random() * types.length)],
      titre: `Document juridique ${i + 1}`,
      source: sources[Math.floor(Math.random() * sources.length)],
      abstract: `Résumé du document juridique ${i + 1}. Ceci est un exemple de contenu.`,
      references: [`Ref-${Math.floor(Math.random() * 1000)}`],
      themes: [themes[Math.floor(Math.random() * themes.length)]],
      x: Math.random() * 100,
      y: Math.random() * 100,
      explored: Math.random() > 0.5,
      connections: []
    }))

    // Add connections between points with the same theme
    results.forEach((point, index) => {
      results.slice(index + 1).forEach(otherPoint => {
        if (point.themes[0] === otherPoint.themes[0]) {
          point.connections.push(otherPoint.id)
          otherPoint.connections.push(point.id)
        }
      })
    })

    return results
  }

  const mockSynonyms = {
    'contrat': ['convention', 'accord', 'pacte'],
    'juridique': ['légal', 'judiciaire', 'juridictionnel'],
    'obligation': ['engagement', 'devoir', 'responsabilité']
  }

  const handleSearch = () => {
    setLoading(true)
    // Recherche de synonymes
    const words = query.toLowerCase().split(' ')
    const foundSynonyms = words.reduce((acc, word) => {
      if (mockSynonyms[word]) {
        acc[word] = mockSynonyms[word]
      }
      return acc
    }, {})
    setSynonyms(foundSynonyms)

    // Simulation de recherche
    setTimeout(() => {
      setResults(generateMockResults())
      setLoading(false)
    }, 1000)
  }

  const getIcon = (type) => {
    switch(type) {
      case 'jurisprudence': return <Scale className="h-4 w-4" />
      case 'code': return <BookOpen className="h-4 w-4" />
      case 'doctrine': return <GraduationCap className="h-4 w-4" />
      default: return null
    }
  }

  const handleZoom = (newZoom) => {
    setZoom(newZoom[0])
  }

  const exportToExcel = () => {
    if (!results) return

    const csvContent = [
      ['Company', 'Query', 'Results', 'Key People'],
      ...results.map(result => [
        result.source,
        query,
        result.abstract,
        '' // Placeholder for Key People, as it's not in our mock data
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'export.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  useEffect(() => {
    if (visualizationRef.current) {
      visualizationRef.current.style.transform = `scale(${zoom})`
    }
  }, [zoom])

  return (
    <div className={`w-full max-w-6xl p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      {/* Barre de titre Windows 98 */}
      <motion.div 
        className={`${darkMode ? 'bg-gray-800' : 'bg-[#000080]'} text-white p-2 mb-4 flex justify-between items-center`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-lg font-bold">LexAI - Recherche juridique</h1>
        <div className="flex items-center space-x-2">
          <Switch
            checked={darkMode}
            onCheckedChange={setDarkMode}
            className="data-[state=checked]:bg-gray-600"
          />
          {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Panneau des filtres et détails du document */}
        <div className="w-full md:w-64 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className={darkMode ? 'bg-gray-800 text-white' : ''}>
              <CardHeader>
                <CardTitle>Filtres</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Période */}
                <div>
                  <label className="block mb-2 text-sm font-medium">Période</label>
                  <Input
                    type="date"
                    value={filters.dateDebut}
                    onChange={(e) => setFilters({...filters, dateDebut: e.target.value})}
                    className={`mb-2 ${darkMode ? 'bg-gray-700 text-white' : ''}`}
                  />
                  <Input
                    type="date"
                    value={filters.dateFin}
                    onChange={(e) => setFilters({...filters, dateFin: e.target.value})}
                    className={darkMode ? 'bg-gray-700 text-white' : ''}
                  />
                </div>

                {/* Type de document */}
                <div>
                  <label className="block mb-2 text-sm font-medium">Type de document</label>
                  <Select onValueChange={(value) => setFilters({...filters, typeDocument: value})}>
                    <SelectTrigger className={darkMode ? 'bg-gray-700 text-white' : ''}>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous</SelectItem>
                      <SelectItem value="jurisprudence">Jurisprudence</SelectItem>
                      <SelectItem value="code">Codes</SelectItem>
                      <SelectItem value="doctrine">Doctrine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Juridiction */}
                <div>
                  <label className="block mb-2 text-sm font-medium">Juridiction</label>
                  <Select onValueChange={(value) => setFilters({...filters, juridiction: value})}>
                    <SelectTrigger className={darkMode ? 'bg-gray-700 text-white' : ''}>
                      <SelectValue placeholder="Sélectionner une juridiction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Toutes</SelectItem>
                      <SelectItem value="cassation">Cour de cassation</SelectItem>
                      <SelectItem value="ce">Conseil d'État</SelectItem>
                      <SelectItem value="ca">Cours d'appel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Thématique */}
                <div>
                  <label className="block mb-2 text-sm font-medium">Thématique</label>
                  <Select onValueChange={(value) => setFilters({...filters, thematique: value})}>
                    <SelectTrigger className={darkMode ? 'bg-gray-700 text-white' : ''}>
                      <SelectValue placeholder="Sélectionner une thématique" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Toutes</SelectItem>
                      <SelectItem value="civil">Civil</SelectItem>
                      <SelectItem value="penal">Pénal</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Panneau de détail */}
          <AnimatePresence>
            {selectedPoint && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={darkMode ? 'bg-gray-800 text-white' : ''}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        {getIcon(selectedPoint.type)}
                        <span className="text-sm text-gray-600">{selectedPoint.source}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedPoint(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <h3 className="font-bold mb-2">{selectedPoint.titre}</h3>
                    <p className="text-sm mb-4">{selectedPoint.abstract}</p>
                    
                    {selectedPoint.references && (
                      <div className="mb-4">
                        <h4 className="font-bold mb-2 text-sm">Références</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedPoint.references.map((ref, i) => (
                            <span key={i} className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                              {ref}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedPoint.themes && (
                      <div>
                        <h4 className="font-bold mb-2 text-sm">Thèmes</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedPoint.themes.map((theme, i) => (
                            <span key={i} className="text-xs text-blue-600 hover:underline cursor-pointer">
                              {theme}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={`mt-4 p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="font-bold mb-1 text-sm">État</div>
                      <div className={`text-sm ${selectedPoint.explored ? 'text-green-500' : 'text-red-500'}`}>
                        {selectedPoint.explored ? 'Exploré' : 'Non exploré'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Zone principale */}
        <div className="flex-1">
          {/* Barre de recherche */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className={darkMode ? 'bg-gray-800 text-white' : ''}>
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher dans tous les fonds documentaires..."
                    className={`flex-1 ${darkMode ? 'bg-gray-700 text-white' : ''}`}
                  />
                  <Button onClick={handleSearch} className={darkMode ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-[#c0c0c0] text-black hover:bg-[#d0d0d0]'}>
                    {loading ? <RotateCw className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    Rechercher
                  </Button>
                </div>

                {/* Affichage des synonymes */}
                <AnimatePresence>
                  {Object.keys(synonyms).length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`mt-4 p-2 border rounded overflow-hidden ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    >
                      <p className="font-bold mb-1 text-sm">Synonymes trouvés:</p>
                      {Object.entries(synonyms).map(([word, syns]) => (
                        <div key={word} className="text-sm">
                          <span className="font-medium">{word}:</span>{' '}
                          {syns.join(', ')}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Visualisation des points */}
          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className={`mt-4 ${darkMode ? 'bg-gray-800 text-white' : ''}`}>
                  <CardContent className="p-0">
                    <div className={`relative overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-white'}`} style={{ height: '600px', width: '100%' }}>
                      <svg className="absolute inset-0" style={{ width: '100%', height: '100%' }}>
                        {results.map((result) => (
                          result.connections.map((connectedId) => {
                            const connectedPoint = results.find(r => r.id === connectedId)
                            return (
                              <line
                                key={`${result.id}-${connectedId}`}
                                x1={`${result.x}%`}
                                y1={`${result.y}%`}
                                x2={`${connectedPoint.x}%`}
                                y2={`${connectedPoint.y}%`}
                                stroke={darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}
                                strokeWidth="1"
                              />
                            )
                          })
                        ))}
                      </svg>
                      <div ref={visualizationRef} className="absolute inset-0 origin-center transition-transform duration-300">
                        {results.map((result) => (
                          <motion.div
                            key={result.id}
                            className={`absolute cursor-pointer rounded-full transition-all ${result.explored ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{
                              left: `${result.x}%`,
                              top: `${result.y}%`,
                              width: '12px',
                              height: '12px',
                            }}
                            whileHover={{ scale: 1.5, zIndex: 10 }}
                            onClick={() => setSelectedPoint(result)}
                            title={`${result.titre} (État: ${result.explored ? 'Exploré' : 'Non exploré'})`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className={`mt-4 p-2 border rounded text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                      <h4 className="font-bold mb-2">Légende :</h4>
                      <div className="flex items-center space-x-2">
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                        <span>Exploré</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                        <span>Non exploré</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ZoomOut className="h-4 w-4" />
                        <Slider
                          value={[zoom]}
                          onValueChange={handleZoom}
                          min={0.5}
                          max={2}
                          step={0.1}
                          className="w-48"
                        />
                        <ZoomIn className="h-4 w-4" />
                      </div>
                      <Button onClick={exportToExcel} className={darkMode ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-[#c0c0c0] text-black hover:bg-[#d0d0d0]'}>
                        <Download className="mr-2 h-4 w-4" />
                        Exporter en Excel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}