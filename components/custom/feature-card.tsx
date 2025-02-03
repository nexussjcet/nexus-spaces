interface FeatureCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="border border-zinc-800 p-6 rounded-md hover:border-zinc-700 transition-all duration-300 cursor-default">
      <div className="flex items-start space-x-4">
        <div className="bg-zinc-900 p-2 rounded-md">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-zinc-400 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}