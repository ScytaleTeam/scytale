import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface MiddleCardProps {
    title: string;
    bottom: string;
    children?: React.ReactNode;
}

const MiddleCard: React.FC<MiddleCardProps> = ({ title, bottom,children}) => {
    return (
        <div className="">
            <Card>
                <CardHeader>
                    <CardTitle className=" flex justify-between">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                {children}
                </CardContent>
              
            </Card>

        </div>
    );
};

export default MiddleCard;
