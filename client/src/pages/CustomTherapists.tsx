import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { TherapistPersona, TherapyApproach, fetchCustomTherapists, deleteCustomTherapist } from '@/lib/therapistPersonas';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  ChevronLeft,
  Plus,
  Pencil,
  Trash2
} from 'lucide-react';

export default function CustomTherapistsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  // Auth context to be implemented later
  const userId = 1; // Default to 1 for testing until auth is implemented
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [therapistToDelete, setTherapistToDelete] = useState<number | string | null>(null);
  
  // Fetch custom therapists
  const { data: customTherapists = [], isLoading, error, refetch } = useQuery({
    queryKey: ['/api/users', userId, 'custom-therapists'],
    queryFn: () => fetchCustomTherapists(userId),
    enabled: !!userId
  });

  // Handle deletion
  const handleDelete = async () => {
    if (!therapistToDelete) return;
    
    try {
      const success = await deleteCustomTherapist(therapistToDelete);
      
      if (success) {
        toast({
          title: t('therapist_deleted_success'),
          duration: 3000
        });
        
        // Refetch the updated list
        refetch();
        
        // Close the dialog
        setIsDeleteDialogOpen(false);
        setTherapistToDelete(null);
      } else {
        toast({
          title: t('error'),
          description: t('therapist_deletion_error'),
          variant: 'destructive',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error deleting therapist:', error);
      toast({
        title: t('error'),
        description: t('therapist_deletion_error'),
        variant: 'destructive',
        duration: 3000
      });
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <header className="mb-6">
        <div className="flex items-center mb-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t('back_to_therapists')}
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold">{t('manage_custom_therapists')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('customize_therapist')}
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Create new therapist card */}
        <Link href="/custom-therapists/create">
          <Card className="h-full border-dashed cursor-pointer hover:border-primary/50 transition-colors">
            <CardContent className="flex flex-col items-center justify-center h-full py-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">{t('create_custom_therapist')}</h2>
              <p className="text-center text-muted-foreground">
                {t('design_own_therapist')}
              </p>
            </CardContent>
          </Card>
        </Link>
        
        {/* Existing custom therapists */}
        {isLoading ? (
          <Card>
            <CardContent className="py-6">
              <div className="h-32 flex items-center justify-center">
                <p>{t('thinking')}</p>
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border-destructive">
            <CardContent className="py-6">
              <div className="h-32 flex items-center justify-center">
                <p className="text-destructive">{t('error')}</p>
              </div>
            </CardContent>
          </Card>
        ) : customTherapists.length === 0 ? (
          <Card>
            <CardContent className="py-6">
              <div className="h-32 flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  {t('no_custom_therapists_yet')}<br />
                  {t('click_to_create_first')}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          customTherapists.map((therapist) => (
            <Card key={therapist.id} className="relative">
              <CardHeader>
                <div className="flex items-center">
                  <div 
                    className="w-12 h-12 rounded-full border flex items-center justify-center mr-4 text-xl" 
                    style={{ borderColor: therapist.color }}
                  >
                    {therapist.icon}
                  </div>
                  <div>
                    <CardTitle>{therapist.name}</CardTitle>
                    <CardDescription>{therapist.title}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">{therapist.description}</p>
                {therapist.baseTherapyApproach && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">{t('based_on')}: </span> 
                    {therapist.baseTherapyApproach}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Link href={`/custom-therapists/edit/${therapist.id}`}>
                  <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4 mr-1" />
                    {t('edit_custom_therapist')}
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    setTherapistToDelete(therapist.id);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  {t('delete')}
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirm_delete_therapist')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirm_delete_therapist_description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}