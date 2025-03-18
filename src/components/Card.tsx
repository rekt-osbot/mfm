interface CardProps {
  title: string;
  description: string;
  link?: string;
}

export default function Card({ title, description, link }: CardProps) {
  return (
    <div className="p-6 mt-6 text-left border w-96 rounded-xl hover:shadow-lg transition-shadow duration-200">
      <h3 className="text-2xl font-bold">{title} {link && '→'}</h3>
      <p className="mt-4 text-xl">{description}</p>
      {link && (
        <a 
          href={link}
          className="mt-4 inline-block text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more
        </a>
      )}
    </div>
  );
} 