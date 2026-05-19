import { useState, useEffect, useRef } from 'react'
import { 
  Shield, 
  Search,
  Printer,
  BookOpen,
  ArrowRight,
  X,
  ChevronRight
} from 'lucide-react'
import mappingsData from './mappings.json'
import { type SecurityControl, STANDARDS, type ComplianceStandard, type MappingDetail } from './types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const controls = mappingsData as unknown as SecurityControl[]

interface SelectedMapping {
  control: SecurityControl;
  standardKey: ComplianceStandard;
  detail: MappingDetail;
}

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SecurityControl[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchResult, setSearchResult] = useState<SecurityControl | null>(null)
  const [selectedMapping, setSelectedMapping] = useState<SelectedMapping | null>(null)

  const suggestionRef = useRef<HTMLDivElement>(null)
  const printRef = useRef<HTMLDivElement>(null)

  // Handle clicking outside of suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close slideover on Escape
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedMapping(null)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const handlePrint = () => {
    window.print();
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    
    if (value.length > 0) {
      const filtered = controls.filter(c => 
        c.label.toLowerCase().includes(value.toLowerCase()) ||
        c.description.toLowerCase().includes(value.toLowerCase()) ||
        c.id.toLowerCase().includes(value.toLowerCase()) ||
        c.keywords?.some(k => k.toLowerCase().includes(value.toLowerCase()))
      )
      setSuggestions(filtered.slice(0, 5)) // Limit to 5 suggestions
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (control: SecurityControl) => {
    setSearchQuery(control.label)
    setSearchResult(control)
    setShowSuggestions(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const found = controls.find(c => 
      c.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.keywords?.some(k => k.toLowerCase() === searchQuery.toLowerCase())
    )
    setSearchResult(found || null)
    setShowSuggestions(false)
  }

  const openMappingDetail = (control: SecurityControl, standardKey: ComplianceStandard, detail: MappingDetail) => {
    setSelectedMapping({ control, standardKey, detail })
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-x-hidden print:min-h-0 print:bg-white">
      {/* SlideOver Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 print:hidden",
          selectedMapping ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSelectedMapping(null)}
      />

      {/* SlideOver Content */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-full md:max-w-[50%] bg-white/95 backdrop-blur-xl border-l border-border z-[70] shadow-2xl transition-transform duration-500 ease-out transform print:translate-x-0 print:max-w-none print:h-auto print:static print:shadow-none print:border-none print:z-0 print:bg-white",
          selectedMapping ? "translate-x-0" : "translate-x-full"
        )}
      >
        {selectedMapping && (
          <div className="h-full flex flex-col print:h-auto" ref={printRef}>
            <div className="px-6 h-16 border-b border-border flex items-center justify-between print:bg-transparent print:p-0 print:mb-8 print:border-none">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary print:hidden" />
                <h2 className="text-sm font-bold uppercase tracking-widest print:text-2xl">Requirement Details</h2>
              </div>
              <div className="flex items-center gap-1 print:hidden">
                <button 
                  onClick={handlePrint}
                  className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-primary"
                  title="Print to PDF"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setSelectedMapping(null)}
                  className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-12 print:overflow-visible print:p-0 print:space-y-12">
              {/* Standard Section */}
              <section className="space-y-4 print:break-inside-avoid">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 print:text-xs">Standard Framework</label>
                <div className="space-y-1">
                  <div className="text-2xl font-black tracking-tight text-foreground print:text-3xl">
                    {STANDARDS[selectedMapping.standardKey].label}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider print:text-sm">
                    Release Version {STANDARDS[selectedMapping.standardKey].version}
                  </div>
                </div>
              </section>

              {/* Recommendation Section */}
              <section className="space-y-4 print:break-inside-avoid">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 print:text-xs">Specific Requirement</label>
                <div className="space-y-4">
                  <div className="inline-flex items-center px-2 py-0.5 rounded bg-primary/5 text-primary text-[10px] font-bold border border-primary/10 print:border-primary print:text-sm">
                    {selectedMapping.detail.clause}
                  </div>
                  <p className="text-lg leading-relaxed font-medium text-foreground/80 print:text-xl">
                    {selectedMapping.detail.text}
                  </p>
                </div>
              </section>

              {/* Expected Control Section */}
              <section className="space-y-4 print:break-inside-avoid">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 print:text-xs">Unified Security Control</label>
                <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50 space-y-4 print:bg-transparent print:p-0 print:border-none">
                  <h3 className="text-xl font-bold text-primary tracking-tight print:text-2xl">{selectedMapping.control.label}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed print:text-base">
                    {selectedMapping.control.description}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-1.5 print:hidden">
                    {selectedMapping.control.keywords?.map(kw => (
                      <span key={kw} className="text-[9px] px-2 py-0.5 bg-white border border-border rounded text-muted-foreground font-bold uppercase tracking-tighter">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <div className="p-6 border-t border-border print:hidden">
              <button 
                onClick={() => setSelectedMapping(null)}
                className="w-full py-3 border border-border hover:bg-secondary rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Return to Reference
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-bold tracking-tight uppercase">SCD Vocabulary</h1>
          </div>
          <div className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase hidden sm:block">
            Compliance Crosswalk Reference
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-8 space-y-12 print:hidden">
        {/* Hero Section */}
        <section className="text-center space-y-3 py-12">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter">
            Security Control <span className="text-primary/60 font-medium">Dictionary</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            A unified reference mapping security controls across major global compliance frameworks.
          </p>
        </section>

        {/* Quick Lookup Feature */}
        <section className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="relative group">
            <div className="relative flex items-center" ref={suggestionRef}>
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search domains (e.g. Access, Physical, Cryptography...)"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                className="w-full bg-white border border-border rounded-2xl pl-12 pr-4 py-4 text-base shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary/20 transition-all"
              />
              
              {/* Autocomplete Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                  {suggestions.map((control) => (
                    <button
                      key={control.id}
                      type="button"
                      onClick={() => handleSuggestionClick(control)}
                      className="w-full text-left px-5 py-3 hover:bg-secondary/50 flex items-center justify-between group transition-colors border-b last:border-b-0 border-border/50"
                    >
                      <div>
                        <div className="font-bold text-sm group-hover:text-primary transition-colors">{control.label}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">{control.category}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </form>

          {searchResult ? (
            <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-primary/5">
                    <BookOpen className="w-4 h-4 text-primary/70" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary/70">Framework Mappings</span>
                </div>
                <div className="text-[10px] text-muted-foreground uppercase font-medium">
                  {searchResult.label}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                 {(['iso', 'soc2', 'nist', 'cis', 'cobit', 'pci', 'gdpr', 'dora'] as ComplianceStandard[]).map(stdKey => (
                   <div 
                     key={stdKey}
                     className={cn(
                       "p-4 rounded-xl border transition-all duration-200",
                       searchResult.mappings[stdKey] 
                         ? "bg-white border-border hover:border-primary/30 hover:shadow-sm cursor-pointer group" 
                         : "bg-secondary/20 border-transparent opacity-40 select-none"
                     )}
                     onClick={() => searchResult.mappings[stdKey] && openMappingDetail(searchResult, stdKey, searchResult.mappings[stdKey]!)}
                   >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="text-[10px] font-black text-primary/40">
                          {stdKey.toUpperCase()}
                        </div>
                      </div>
                      {searchResult.mappings[stdKey] && (
                        <ChevronRight className="w-3.5 h-3.5 text-primary/20 group-hover:text-primary/60 transition-colors" />
                      )}
                    </div>
                    {searchResult.mappings[stdKey] ? (
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold text-primary">
                          {searchResult.mappings[stdKey]?.clause}
                        </div>
                        <div className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                          {searchResult.mappings[stdKey]?.text}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[10px] text-muted-foreground/30 italic">Not applicable</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50">
                <div className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-2">Definition</div>
                <p className="text-sm leading-relaxed text-foreground/80">
                  <span className="font-bold text-foreground">{searchResult.label}</span>: {searchResult.description}
                </p>
              </div>
            </div>
          ) : searchQuery && !showSuggestions && (
            <div className="mt-12 text-center py-12 rounded-2xl border border-dashed border-border bg-secondary/10">
              <p className="text-sm text-muted-foreground italic">
                No exact mapping found for "{searchQuery}".
              </p>
            </div>
          )}
        </section>


      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mb-4">SCD Vocabulary</p>
          <p className="text-xs text-muted-foreground/60 max-w-md mx-auto leading-relaxed">
            Zero-knowledge client-side reference tool for security professionals. 
            Mappings are for educational purposes.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
