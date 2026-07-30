import React, { useState } from 'react';
import { NewProgressData } from '../../hooks/useProgress';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  onAddEntry: (newEntryData: NewProgressData) => Promise<void>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onAddEntry }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [category, setCategory] = useState<'Front' | 'Side' | 'Back' | 'Other'>('Front');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Clean up previous object URL to prevent memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!imageFile) {
      alert('Please select an image to upload.');
      return;
    }

    setIsSubmitting(true);
    try {
      // The onAddEntry function now expects a single object matching NewProgressData
      await onAddEntry({
        image: imageFile,
        weight: weight ? parseFloat(weight) : undefined,
        waist: waist ? parseFloat(waist) : undefined,
        bodyFat: bodyFat ? parseFloat(bodyFat) : undefined, // Field name updated
        category,
      });

      // Reset form fields after successful submission
      setImageFile(null);
      setPreviewUrl(null);
      setWeight('');
      setWaist('');
      setBodyFat('');
      setCategory('Front');
      // Also reset the file input visually
      const fileInput = document.getElementById('progress-image') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error("Failed to submit progress entry:", error);
      // Error toast is handled in the useProgress hook, so no need to show another one here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Add New Progress Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-2">
              <Label htmlFor="progress-image">Upload Image*</Label>
              <Input
                id="progress-image"
                type="file"
                accept="image/*"
                required
                onChange={handleFileChange}
                className="file:text-primary file:font-semibold"
              />
              {previewUrl && (
                <div className="mt-4">
                  <img src={previewUrl} alt="Preview" className="rounded-lg max-h-48 w-full object-contain bg-muted" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g., 75.5" />
                </div>
                <div>
                  <Label htmlFor="waist">Waist (cm)</Label>
                  <Input id="waist" type="number" step="0.1" value={waist} onChange={e => setWaist(e.target.value)} placeholder="e.g., 80" />
                </div>
                <div>
                  <Label htmlFor="bodyFat">Body Fat (%)</Label>
                  <Input id="bodyFat" type="number" step="0.1" value={bodyFat} onChange={e => setBodyFat(e.target.value)} placeholder="e.g., 15" />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Front">Front</SelectItem>
                      <SelectItem value="Side">Side</SelectItem>
                      <SelectItem value="Back">Back</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Saving...' : 'Save Progress'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ImageUploader;