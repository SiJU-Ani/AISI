import { useEffect, useState } from 'react'
import { createClientSupabaseClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function SupabaseStatusExample() {
  const [status, setStatus] = useState<{
    configured: boolean
    url: string | null
    error: string | null
  }>({
    configured: false,
    url: null,
    error: null,
  })

  useEffect(() => {
    try {
      const client = createClientSupabaseClient()
      const url = import.meta.env.VITE_SUPABASE_URL
      const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

      setStatus({
        configured: !!url && !!key,
        url: url || null,
        error: null,
      })
    } catch (error) {
      setStatus({
        configured: false,
        url: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }, [])

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Supabase Status</CardTitle>
        <CardDescription>Check your Supabase configuration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status.error ? (
          <Alert variant="destructive">
            <AlertDescription>
              <strong>Error:</strong> {status.error}
            </AlertDescription>
          </Alert>
        ) : status.configured ? (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              ✅ <strong>Supabase is configured</strong>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertDescription className="text-yellow-800">
              ⚠️ <strong>Supabase is not configured</strong>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2 text-sm">
          <div>
            <p className="font-semibold">Configuration Status:</p>
            <p className="text-gray-600">{status.configured ? '✅ Configured' : '❌ Not configured'}</p>
          </div>

          {status.url && (
            <div>
              <p className="font-semibold">Supabase URL:</p>
              <p className="text-gray-600 break-all">{status.url}</p>
            </div>
          )}

          <div>
            <p className="font-semibold">Environment Variables:</p>
            <code className="text-xs bg-gray-100 p-2 rounded block">
              VITE_SUPABASE_URL={import.meta.env.VITE_SUPABASE_URL || '(not set)'}
              <br />
              VITE_SUPABASE_PUBLISHABLE_KEY={(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.substring(0, 20) || '(not set)') + '...'}
            </code>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-gray-700">
          <p className="font-semibold mb-2">Next Steps:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Copy .env.example to .env.local</li>
            <li>Add your Supabase credentials to .env.local</li>
            <li>Restart your dev server</li>
            <li>This status should show ✅ Configured</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
