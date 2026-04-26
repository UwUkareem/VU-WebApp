import { PauseCircle, XCircle, RefreshCw, CheckCircle, Rocket, Save } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';

export function EditFooterActions({ status, onSaveChanges, onStatusChange }) {
  switch (status) {
    case 'active':
      return (
        <>
          <Button
            variant="ghost"
            iconLeft={<PauseCircle size={16} />}
            onClick={() => onStatusChange?.('paused')}
          >
            Pause Job
          </Button>
          <Button
            variant="danger"
            iconLeft={<XCircle size={16} />}
            onClick={() => onStatusChange?.('closed')}
          >
            Close Job
          </Button>
          <Button variant="primary" iconLeft={<CheckCircle size={16} />} onClick={onSaveChanges}>
            Save Changes
          </Button>
        </>
      );
    case 'scheduled':
      return (
        <>
          <Button
            variant="ghost"
            iconLeft={<XCircle size={16} />}
            onClick={() => onStatusChange?.('draft')}
          >
            Unpublish
          </Button>
          <Button variant="primary" iconLeft={<CheckCircle size={16} />} onClick={onSaveChanges}>
            Save Changes
          </Button>
        </>
      );
    case 'closed':
      return (
        <>
          <Button
            variant="ghost"
            iconLeft={<RefreshCw size={16} />}
            onClick={() => onStatusChange?.('active')}
          >
            Reopen Job
          </Button>
          <Button variant="primary" iconLeft={<CheckCircle size={16} />} onClick={onSaveChanges}>
            Save Changes
          </Button>
        </>
      );
    default: // draft
      return (
        <>
          <Button variant="ghost" iconLeft={<Save size={16} />} onClick={onSaveChanges}>
            Save Draft
          </Button>
          <Button
            variant="primary"
            iconLeft={<Rocket size={16} />}
            onClick={() => onStatusChange?.('active')}
          >
            Publish Job
          </Button>
        </>
      );
  }
}
