'use client'

import { useState, useEffect, SetStateAction } from 'react'
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion"

export default function LawXLLMApp() {
  const [query, setQuery] = useState('')

  useEffect(() => {
    // Ensure dark mode is always active
    document.documentElement.classList.add('dark')
  }, [])

  // Case context data from the French legal case
  const caseContext = {
    title: "Cass. com., 14 mai 2013",
    date: "14 mai 2013",
    facts: "M. X..., administrateur et directeur général de la société Asterop, a été révoqué de ses fonctions d'administrateur sans que ce point ait été inscrit à l'ordre du jour de l'assemblée des actionnaires. Il a assigné la société et les actionnaires majoritaires en paiement de dommages-intérêts.",
    legalIssue: "La révocation abusive d'un administrateur et la responsabilité des actionnaires majoritaires.",
    solution: "La Cour de cassation a cassé l'arrêt en ce qu'il avait rejeté les demandes de M. X... dirigées contre la société au titre du caractère abusif de sa révocation. Elle a jugé que la cour d'appel n'avait pas recherché si M. X... avait eu connaissance des motifs de sa révocation avant le vote.",
    scope: "Cet arrêt confirme que la révocation d'un administrateur peut être abusive si elle a été accompagnée de circonstances ou a été prise dans des conditions qui portent atteinte à sa réputation ou à son honneur.",
    specificConditions: "La Cour a souligné que la révocation d'un administrateur peut être abusive si elle a été accompagnée de circonstances ou a été prise dans des conditions qui portent atteinte à sa réputation ou à son honneur."
  }

  // Mock data for results with keywords and synonyms
  const resultsData = [
    {
      id: "1",
      keyword: "Révocation",
      synonyms: ["Licenciement", "Destitution"],
      color: "bg-blue-950/20",
      results: [
        {
          text: "Cass. com., 24 février 1998",
          description: "Révocation d'un administrateur pour justes motifs",
          relevance: "High"
        },
        {
          text: "Cass. com., 22 janvier 1991",
          description: "Conditions de révocation des administrateurs",
          relevance: "High"
        }
      ]
    },
    {
      id: "2",
      keyword: "Abus",
      synonyms: ["Excès", "Détournement"],
      color: "bg-purple-950/20",
      results: [
        {
          text: "Cass. com., 4 mai 2010",
          description: "Caractérisation de l'abus dans la révocation",
          relevance: "High"
        },
        {
          text: "Cass. com., 15 novembre 2005",
          description: "Critères de l'abus de droit",
          relevance: "Medium"
        }
      ]
    },
    {
      id: "3",
      keyword: "Dommages-intérêts",
      synonyms: ["Indemnisation", "Réparation"],
      color: "bg-green-950/20",
      results: [
        {
          text: "Cass. com., 19 décembre 2018",
          description: "Évaluation des dommages-intérêts",
          relevance: "Medium"
        },
        {
          text: "Cass. com., 6 mai 2014",
          description: "Conditions d'octroi des dommages-intérêts",
          relevance: "High"
        }
      ]
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", query)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Law xLLM Application</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
          {/* Case Context */}
          <Card className="bg-gray-800 overflow-auto">
            <CardHeader className="sticky top-0 bg-gray-800 z-10">
              <CardTitle className="text-xl">Contexte de l&apos;Arrêt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">{caseContext.title}</h2>
                <p className="text-sm text-gray-400">{caseContext.date}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-300">Faits principaux:</h3>
                <p className="text-sm">{caseContext.facts}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-300">Problème de droit:</h3>
                <p className="text-sm">{caseContext.legalIssue}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-300">Solution:</h3>
                <p className="text-sm">{caseContext.solution}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-300">Portée de l&apos;arrêt:</h3>
                <p className="text-sm">{caseContext.scope}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-300">Conditions spécifiques:</h3>
                <p className="text-sm">{caseContext.specificConditions}</p>
              </div>
            </CardContent>
          </Card>

          {/* Query Input */}
          <Card className="bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl">Recherche</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Entrez votre recherche"
                  value={query}
                  onChange={(e: { target: { value: SetStateAction<string> } }) => setQuery(e.target.value)}
                  className="bg-gray-700 text-gray-100 border-gray-600"
                />
                <Button type="submit" className="w-full">Rechercher</Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Accordion */}
          <Card className="bg-gray-800 overflow-auto">
            <CardHeader className="sticky top-0 bg-gray-800 z-10">
              <CardTitle className="text-xl">Résultats</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {resultsData.map((group) => (
                  <AccordionItem 
                    key={group.id} 
                    value={group.id}
                    className={`rounded-lg ${group.color}`}
                  >
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <span className="hover:underline">
                        {group.keyword} ({group.synonyms.join(", ")})
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-4">
                        {group.results.map((item, index) => (
                          <div key={index} className="bg-gray-700/50 p-3 rounded-md">
                            <p className="font-medium">
                              {item.text}
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                              {item.description}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              Pertinence: {item.relevance}
                            </p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}