import { useSuspenseQuery } from '@tanstack/react-query'
import { fetchTodos, createTodo, deleteTodo } from '@/routes/api.supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'

export default function TodoListExample() {
  const [newTodoName, setNewTodoName] = useState('')

  // Fetch todos using server function
  const { data } = useSuspenseQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const result = await fetchTodos()
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data || []
    },
  })

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodoName.trim()) return

    try {
      const result = await createTodo({ name: newTodoName })
      if (result.success) {
        setNewTodoName('')
        // Refetch todos (normally handled by React Query)
      } else {
        console.error('Error creating todo:', result.error)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDeleteTodo = async (id: string) => {
    try {
      const result = await deleteTodo({ id })
      if (!result.success) {
        console.error('Error deleting todo:', result.error)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Todos (Supabase)</CardTitle>
        <CardDescription>Manage your todos stored in Supabase PostgreSQL</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Todo Form */}
        <form onSubmit={handleAddTodo} className="flex gap-2">
          <Input
            value={newTodoName}
            onChange={(e) => setNewTodoName(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1"
          />
          <Button type="submit">Add</Button>
        </form>

        {/* Todos List */}
        <div className="space-y-2">
          {Array.isArray(data) && data.length > 0 ? (
            data.map((todo: any) => (
              <div
                key={todo.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">{todo.name}</p>
                  <p className="text-sm text-gray-500">ID: {todo.id}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  Delete
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No todos yet. Add one to get started!</p>
          )}
        </div>

        {/* Setup Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
          <p className="font-semibold mb-2">📝 Setup Instructions:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local</li>
            <li>Create a 'todos' table in your Supabase database with: id (uuid), name (text), completed (boolean)</li>
            <li>This example fetches todos from Supabase and allows CRUD operations</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
