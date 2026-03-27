import { useState } from 'react'
import { ChefHat, Menu, Plus, AlertTriangle, Refrigerator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FavoritesSidebar } from '@/components/organisms/FavoritesSidebar'
import { ChatMessages } from '@/components/organisms/ChatMessages'
import { ChatInputBar } from '@/components/organisms/ChatInputBar'
import { FridgeModeSheet } from '@/components/organisms/FridgeModeSheet'
import { useChatStore } from '@/stores/chatStore'

export function ChatLayout() {
  const [inputValue, setInputValue] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [fridgeOpen, setFridgeOpen] = useState(false)
  const clearMessages = useChatStore((s) => s.clearMessages)
  const favorites = useChatStore((s) => s.favorites)

  function handleNewConversation() {
    if (!confirmClear) {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 3000)
      return
    }
    clearMessages()
    setConfirmClear(false)
  }

  return (
    <div className="flex h-svh bg-background">
      <FavoritesSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-between border-b px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="relative lg:hidden">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setSidebarOpen(true)}
                className="text-muted-foreground"
              >
                <Menu className="size-4" />
              </Button>
              {favorites.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {favorites.length > 9 ? '9+' : favorites.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ChefHat className="size-4" />
                </div>
                <span className="absolute -right-0.5 -top-0.5 flex size-2.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background" />
              </div>
              <div>
                <h1 className="text-sm font-semibold leading-tight">Chef IA</h1>
                <p className="text-xs text-emerald-500">En línea · listo para cocinar</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setFridgeOpen(true)}
              className="text-muted-foreground"
              title="Modo Nevera"
            >
              <Refrigerator className="size-4" />
            </Button>
            <Button
              variant={confirmClear ? 'destructive' : 'ghost'}
              size="sm"
              onClick={handleNewConversation}
              className={confirmClear ? 'gap-1.5' : 'gap-1.5 text-muted-foreground'}
            >
            {confirmClear ? (
              <>
                <AlertTriangle className="size-4" />
                ¿Confirmar?
              </>
            ) : (
              <>
                <Plus className="size-4" />
                Nueva conversación
              </>
            )}
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <ChatMessages onSuggestionClick={setInputValue} />
        </div>

        <ChatInputBar value={inputValue} onChange={setInputValue} />
      </main>

      <FridgeModeSheet open={fridgeOpen} onClose={() => setFridgeOpen(false)} />
    </div>
  )
}
