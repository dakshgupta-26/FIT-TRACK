import React from 'react';
import { ProgressEntry } from '../../hooks/useProgress';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Trash2 } from 'lucide-react';

interface ProgressGalleryProps {
  entries: ProgressEntry[];
  onDelete: (entryId: string) => void;
}

const ProgressGallery: React.FC<ProgressGalleryProps> = ({ entries, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (entries.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">Your Gallery is Empty</h2>
          <p className="text-muted-foreground">Upload your first photo to start tracking your progress!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Progress Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {entries.map((entry) => (
          <Card key={entry.id} className="overflow-hidden group relative flex flex-col">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
              <img src={entry.imageUrl} alt={`Progress from ${formatDate(entry.date)}`} className="w-full h-full object-cover" />
            </div>

            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(entry.id)}
              className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <CardContent className="p-4 flex-grow">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-sm">{formatDate(entry.date)}</p>
                <Badge variant="secondary">{entry.category}</Badge>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                {entry.weight && <p><strong>Weight:</strong> {entry.weight} kg</p>}
                {entry.waist && <p><strong>Waist:</strong> {entry.waist} cm</p>}
                {entry.bodyFat && <p><strong>Body Fat:</strong> {entry.bodyFat}%</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProgressGallery;