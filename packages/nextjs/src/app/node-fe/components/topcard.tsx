import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopCardProps {
    title: string;
    amount: string;


}

const TopCard: React.FC<TopCardProps> = ({ title, amount,  }) => {
    return (
        <div className="">
            <Card>
                <CardHeader>
                    <CardTitle className="font-bold">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className= "font-medium text-l"> {amount}</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default TopCard;
