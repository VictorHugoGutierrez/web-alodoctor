import { toast } from 'sonner';

export function sonnerMessage(
  title: string,
  description: string,
  type: string
) {
  if (type === 'success') {
    toast.success(title, {
      description: description,
      closeButton: true,
    });
  } else if (type === 'error') {
    toast.error(title, {
      description: description,
      closeButton: true,
    });
  } else {
    toast(title, {
      description: description,
      closeButton: true,
    });
  }
}
