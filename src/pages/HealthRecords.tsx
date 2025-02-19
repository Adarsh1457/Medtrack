import { useEffect, useState } from "react";
import { Plus, FileText, Calendar, Download, Trash2, Loader2, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AddHealthRecordDialog } from "@/components/health/AddHealthRecordDialog";
import { RecordPreviewDialog } from "@/components/health/RecordPreviewDialog";
import { useAuth } from "@/contexts/AuthContext";
import { getHealthRecords, deleteHealthRecord, type HealthRecord } from "@/services/healthRecords";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const HealthRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fetchRecords = async () => {
    if (!user) return;
    try {
      const fetchedRecords = await getHealthRecords(user.uid);
      setRecords(fetchedRecords);
    } catch (error) {
      console.error("Error fetching health records:", error);
      toast.error("Failed to load health records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const handleDelete = async (recordId: string) => {
    if (!user || !recordId) return;
    
    try {
      await deleteHealthRecord(user.uid, recordId);
      toast.success("Record deleted successfully");
      await fetchRecords(); // Refresh the records list after deletion
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Failed to delete record");
    }
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    if (!fileUrl) {
      toast.error("No file available for download");
      return;
    }

    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'health-record';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (record: HealthRecord) => {
    setSelectedRecord(record);
    setIsPreviewOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-nothing">HEALTH RECORDS</h1>
        <AddHealthRecordDialog onRecordAdded={fetchRecords} />
      </div>

      {records.length === 0 ? (
        <Card className="card-nothing">
          <CardContent className="p-6 text-center text-muted-foreground font-nothing">
            <p>No health records found. Add your first record to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {records.map((record) => (
            <Card 
              key={record.id} 
              className="card-nothing hover:shadow-md transition-all duration-300 cursor-pointer"
              onClick={() => record.fileUrl && handlePreview(record)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-nothing flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {record.title}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 font-nothing">
                      <Calendar className="h-4 w-4" />
                      {new Date(record.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground font-nothing">{record.doctor}</p>
                    {record.notes && (
                      <p className="text-sm text-muted-foreground mt-2 font-nothing">{record.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {record.fileUrl && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreview(record);
                          }}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(record.fileUrl!, record.fileName || 'health-record');
                          }}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Record</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this health record? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => record.id && handleDelete(record.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <RecordPreviewDialog
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setSelectedRecord(null);
        }}
        record={selectedRecord}
      />

      <div className="system-status">
        <p>SYSTEM STATUS: ONLINE</p>
        <p>BATTERY: 73% | NETWORK: STABLE</p>
      </div>
    </div>
  );
};

export default HealthRecords;