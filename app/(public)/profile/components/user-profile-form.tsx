'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { updateProfile, getName } from '../action/componentactions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function UserProfileForm({
  initialName,
  initialImage,
}: {
  initialName: string;
  initialImage?: string;
}) {
  const [defaultName, setDefaultName] = useState(initialName || '');
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialName || '',
    },
  });

  useEffect(() => {
    async function fetchName() {
      try {
        const name = await getName();
        setDefaultName(name);
        form.reset({ name });
      } catch {
        // fallback: keep initialName
      }
    }
    fetchName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl] = useState(initialImage || '');
  const [isEditing, setIsEditing] = useState(false);

  async function onSubmit(values: ProfileFormValues) {
    setIsLoading(true);
    try {
      await updateProfile({
        name: values.name,
      });
      toast.success('Profile updated!');
      setIsEditing(false);
      setDefaultName(values.name);
    } catch (e) {
      toast.error((e as Error).message || 'Error updating profile');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-card animate-in rounded-xl p-8 shadow-lg">
          <h2 className="text-primary mb-2 text-2xl font-bold">Edit Profile</h2>
          <p className="text-muted-foreground mb-6">
            Update your personal information and avatar.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              autoComplete="off"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="group relative">
                  <Avatar className="border-primary bg-muted h-24 w-24 rounded-lg border-2 shadow transition-shadow group-hover:shadow-xl">
                    <AvatarImage
                      src={avatarUrl || '/avatars/user.jpg'}
                      alt="Avatar Preview"
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          '/avatars/user.jpg';
                      }}
                    />
                    <AvatarFallback className="bg-muted text-muted-foreground rounded-lg text-3xl">
                      <User />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2">
                        <Input
                          {...field}
                          value={field.value}
                          placeholder="Your name"
                          className="font-medium"
                          autoFocus
                          autoComplete="off"
                          disabled={!isEditing}
                        />
                        {isEditing ? (
                          <Button
                            type="submit"
                            variant="outline"
                            className="mt-4 w-full font-semibold transition-transform duration-150 active:scale-95"
                            disabled={isLoading}
                          >
                            {isLoading ? 'Saving...' : 'Save'}
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-4 w-full font-semibold transition-transform duration-150 active:scale-95"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsEditing(true);
                            }}
                          >
                            Edit
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
