import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Pencil, Trash2, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

const TaskCard = ({ task, onEdit, onDelete, showAssignee = false }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'in-progress':
                return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'pending':
                return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
            default:
                return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-500/20 text-red-300 border-red-500/30';
            case 'medium':
                return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
            case 'low':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            default:
                return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
        }
    };

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <div className="flex gap-2">
                        <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
                <div className="flex flex-col gap-2 text-sm">
                    {task.dueDate && (
                        <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Due: {format(new Date(task.dueDate), 'PPP')}</span>
                        </div>
                    )}
                    {showAssignee && task.assignedTo && (
                        <div className="flex items-center text-muted-foreground">
                            <User className="h-4 w-4 mr-2" />
                            <span>Assigned to: {task.assignedTo.name}</span>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(task._id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );
};

export default TaskCard;
