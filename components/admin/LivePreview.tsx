import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LivePreviewProps {
  title: string
  children: React.ReactNode
}

export function LivePreview({ title, children }: LivePreviewProps) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Aperçu en direct : {title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

