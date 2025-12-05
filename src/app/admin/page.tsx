import db from '@/lib/db';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DeleteButton } from './delete-button';

type Appraisal = {
  id: string;
  createdAt: string;
  year: number;
  make: string;
  model: string;
  name: string;
  email: string;
};

function getAppraisals(): Appraisal[] {
  try {
    const stmt = db.prepare('SELECT id, createdAt, year, make, model, name, email FROM appraisals ORDER BY createdAt DESC');
    const appraisals = stmt.all() as Appraisal[];
    return appraisals;
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

export default function AdminPage() {
  const appraisals = getAppraisals();

  return (
    <main className="container mx-auto p-4 sm:p-8">
      <Card>
        <CardHeader>
          <CardTitle>All Appraisal Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of all vehicle appraisal submissions.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appraisals.length > 0 ? (
                appraisals.map((appraisal) => (
                  <TableRow key={appraisal.id}>
                    <TableCell className="font-medium">
                        {new Date(appraisal.createdAt).toLocaleDateString()}
                        <div className="text-xs text-muted-foreground">{appraisal.id}</div>
                    </TableCell>
                    <TableCell>{appraisal.year} {appraisal.make} {appraisal.model}</TableCell>
                    <TableCell>
                        {appraisal.name}
                        <div className="text-xs text-muted-foreground">{appraisal.email}</div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/appraisals/${appraisal.id}`}>View</Link>
                        </Button>
                        <DeleteButton id={appraisal.id} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No submissions yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
