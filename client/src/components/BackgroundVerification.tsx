import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, AlertCircle, Clock, FileText, User, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BackgroundCheckData {
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  submittedAt: string;
  completedAt?: string;
  results?: {
    criminalRecord: 'clear' | 'flagged' | 'pending';
    employmentVerification: 'verified' | 'failed' | 'pending';
    referenceChecks: 'completed' | 'incomplete' | 'pending';
    identityVerification: 'verified' | 'failed' | 'pending';
    creditCheck?: 'good' | 'poor' | 'pending';
  };
  documents?: {
    policeCheck: string;
    referenceLetters: string[];
    employmentHistory: string;
  };
  estimatedCompletion?: string;
}

interface BackgroundVerificationProps {
  stylistId: string;
  onStatusChange?: (status: string) => void;
}

export default function BackgroundVerification({ stylistId, onStatusChange }: BackgroundVerificationProps) {
  const { toast } = useToast();
  const [checkData, setCheckData] = useState<BackgroundCheckData>({
    status: 'completed',
    submittedAt: '2025-01-25T10:00:00Z',
    completedAt: '2025-01-27T14:30:00Z',
    results: {
      criminalRecord: 'clear',
      employmentVerification: 'verified',
      referenceChecks: 'completed',
      identityVerification: 'verified',
      creditCheck: 'good'
    },
    documents: {
      policeCheck: 'police_clearance_2025_verified.pdf',
      referenceLetters: ['reference_sarah_beauty_salon.pdf', 'reference_marcus_client.pdf'],
      employmentHistory: 'employment_verification_complete.pdf'
    },
    estimatedCompletion: '2025-01-28T17:00:00Z'
  });

  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'clear':
      case 'verified':
      case 'good':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
      case 'flagged':
      case 'poor':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'clear':
      case 'verified':
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
      case 'flagged':
      case 'poor':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const initiateNewCheck = () => {
    setCheckData(prev => ({
      ...prev,
      status: 'in-progress',
      submittedAt: new Date().toISOString(),
      completedAt: undefined
    }));
    
    toast({
      title: "Background Check Initiated",
      description: "Comprehensive verification process has begun. You'll receive updates via email.",
    });

    // Simulate progress
    setTimeout(() => {
      setCheckData(prev => ({
        ...prev,
        status: 'completed',
        completedAt: new Date().toISOString()
      }));
      onStatusChange?.('verified');
    }, 5000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <Card className="ios-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-purple-600 mr-3" />
              Background Verification
            </div>
            <Badge className={getStatusColor(checkData.status)}>
              {getStatusIcon(checkData.status)}
              <span className="ml-2 capitalize">{checkData.status.replace('-', ' ')}</span>
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-body">Submitted</span>
              <span className="text-caption text-gray-600">
                {formatDate(checkData.submittedAt)}
              </span>
            </div>
            
            {checkData.completedAt && (
              <div className="flex items-center justify-between">
                <span className="text-body">Completed</span>
                <span className="text-caption text-gray-600">
                  {formatDate(checkData.completedAt)}
                </span>
              </div>
            )}
            
            {checkData.estimatedCompletion && !checkData.completedAt && (
              <div className="flex items-center justify-between">
                <span className="text-body">Estimated Completion</span>
                <span className="text-caption text-gray-600">
                  {formatDate(checkData.estimatedCompletion)}
                </span>
              </div>
            )}

            <div className="flex space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide' : 'View'} Details
              </Button>
              
              {checkData.status === 'completed' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={initiateNewCheck}
                >
                  Renew Check
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      {showDetails && checkData.results && (
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="text-headline">Verification Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Criminal Record Check */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <div>
                    <h4 className="font-medium">Criminal Record Check</h4>
                    <p className="text-sm text-gray-600">Provincial and federal records</p>
                  </div>
                </div>
                <Badge className={getStatusColor(checkData.results.criminalRecord)}>
                  {getStatusIcon(checkData.results.criminalRecord)}
                  <span className="ml-2 capitalize">{checkData.results.criminalRecord}</span>
                </Badge>
              </div>

              {/* Employment Verification */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium">Employment Verification</h4>
                    <p className="text-sm text-gray-600">Previous workplace confirmation</p>
                  </div>
                </div>
                <Badge className={getStatusColor(checkData.results.employmentVerification)}>
                  {getStatusIcon(checkData.results.employmentVerification)}
                  <span className="ml-2 capitalize">{checkData.results.employmentVerification}</span>
                </Badge>
              </div>

              {/* Reference Checks */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium">Reference Checks</h4>
                    <p className="text-sm text-gray-600">Professional & character references</p>
                  </div>
                </div>
                <Badge className={getStatusColor(checkData.results.referenceChecks)}>
                  {getStatusIcon(checkData.results.referenceChecks)}
                  <span className="ml-2 capitalize">{checkData.results.referenceChecks}</span>
                </Badge>
              </div>

              {/* Identity Verification */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <div>
                    <h4 className="font-medium">Identity Verification</h4>
                    <p className="text-sm text-gray-600">Government ID & address confirmation</p>
                  </div>
                </div>
                <Badge className={getStatusColor(checkData.results.identityVerification)}>
                  {getStatusIcon(checkData.results.identityVerification)}
                  <span className="ml-2 capitalize">{checkData.results.identityVerification}</span>
                </Badge>
              </div>

              {/* Credit Check (Optional) */}
              {checkData.results.creditCheck && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-yellow-600" />
                    <div>
                      <h4 className="font-medium">Credit Check</h4>
                      <p className="text-sm text-gray-600">Financial responsibility assessment</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(checkData.results.creditCheck)}>
                    {getStatusIcon(checkData.results.creditCheck)}
                    <span className="ml-2 capitalize">{checkData.results.creditCheck}</span>
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents */}
      {showDetails && checkData.documents && (
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="text-headline">Supporting Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium">Police Clearance Certificate</h4>
                    <p className="text-sm text-gray-600">{checkData.documents.policeCheck}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium">Employment History</h4>
                    <p className="text-sm text-gray-600">{checkData.documents.employmentHistory}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Reference Letters</h4>
                {checkData.documents.referenceLetters.map((letter, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium">Reference #{index + 1}</p>
                        <p className="text-sm text-gray-600">{letter}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Information */}
      <Card className="ios-card bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 mb-1">Security & Privacy</h4>
              <p className="text-sm text-blue-700">
                All background checks are conducted by certified third-party verification services. 
                Your personal information is encrypted and stored securely. Background checks are 
                renewed annually or as required by local regulations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Required */}
      {checkData.status === 'failed' && (
        <Card className="ios-card bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800 mb-2">Action Required</h4>
                <p className="text-sm text-red-700 mb-3">
                  Additional information or documentation is needed to complete your background verification.
                </p>
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}