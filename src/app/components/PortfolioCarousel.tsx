import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import { useState } from 'react';

export function PortfolioCarousel() {
  const navigate = useNavigate();
  const { portfolio } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (portfolio.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Portfólio</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Briefcase className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-3">Nenhum projeto ainda</p>
          <Button size="sm" onClick={() => navigate('/portfolio')}>
            Adicionar Projetos
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? portfolio.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === portfolio.length - 1 ? 0 : prev + 1));
  };

  const currentProject = portfolio[currentIndex];

  return (
    <Card className="cursor-pointer" onClick={() => navigate('/portfolio')}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Portfólio</CardTitle>
        <span className="text-sm text-gray-500">
          {currentIndex + 1} / {portfolio.length}
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative h-40 bg-gray-200 rounded-lg overflow-hidden">
          <img
            src={currentProject.image}
            alt={currentProject.title}
            className="w-full h-full object-cover"
          />
          {portfolio.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
        <div>
          <h4 className="font-semibold">{currentProject.title}</h4>
          <CardDescription className="text-sm mt-1 line-clamp-2">
            {currentProject.description}
          </CardDescription>
          {currentProject.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {currentProject.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {currentProject.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{currentProject.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
