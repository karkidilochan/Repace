export default function QuestionCard({ title, pattern }: { title: string, pattern: string }) {
  return (
    <div className="border p-4 rounded shadow">
      <h3 className="font-bold">{title}</h3>
      <p className="text-gray-500">{pattern}</p>
    </div>
  );
}