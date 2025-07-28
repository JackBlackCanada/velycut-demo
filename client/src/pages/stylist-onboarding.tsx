import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Shield, CheckCircle, AlertCircle, User, Briefcase, Award, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  required: boolean;
  completed: boolean;
}

export default function StylistOnboarding() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Identity Verification
    fullLegalName: '',
    dateOfBirth: '',
    socialInsuranceNumber: '',
    governmentId: null as File | null,
    selfieWithId: null as File | null,
    addressVerification: null as File | null,
    
    // Background Check
    backgroundCheckConsent: false,
    criminalRecordCheck: false,
    referencesProvided: false,
    
    // Professional History
    licenseNumber: '',
    licenseExpiry: '',
    yearsOfExperience: '',
    previousSalons: [] as string[],
    specializations: [] as string[],
    certifications: [] as File[],
    portfolioImages: [] as File[],
    
    // Additional Info
    emergencyContact: '',
    emergencyPhone: '',
    bankingInfo: '',
    taxNumber: '',
    
    // Language proficiency
    motherTongue: '',
    additionalLanguages: [] as Array<{language: string, fluency: string}>,
    
    // Personal Bio
    personalBio: '',
    workHistory: '',
    hobbies: '',
    familyBackground: '',
    personalStory: '',
    whyBecomeStylist: ''
  });

  const [verificationStatus, setVerificationStatus] = useState({
    identity: 'pending',
    background: 'pending',
    professional: 'pending',
    bio: 'pending',
    documents: 'pending'
  });

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'identity',
      title: 'Identity Verification',
      description: 'Verify your identity with government-issued ID',
      required: true,
      completed: verificationStatus.identity === 'approved'
    },
    {
      id: 'background',
      title: 'Background Check',
      description: 'Complete police background verification',
      required: true,
      completed: verificationStatus.background === 'approved'
    },
    {
      id: 'professional',
      title: 'Professional History',
      description: 'Provide work experience and certifications',
      required: true,
      completed: verificationStatus.professional === 'approved'
    },
    {
      id: 'bio',
      title: 'Personal Bio & Story',
      description: 'Share your story and connect with clients',
      required: true,
      completed: verificationStatus.bio === 'approved'
    },
    {
      id: 'portfolio',
      title: 'Portfolio & Documents',
      description: 'Upload portfolio and required documents',
      required: true,
      completed: verificationStatus.documents === 'approved'
    }
  ];

  const specialtyOptions = [
    'Hair Cutting', 'Hair Coloring', 'Highlights', 'Balayage', 'Keratin Treatment',
    'Hair Extensions', 'Bridal Styling', 'Men\'s Cuts', 'Beard Trimming', 'Kids Cuts',
    'Curly Hair Specialist', 'Color Correction', 'Perm', 'Hair Treatments', 'Styling'
  ];

  const handleFileUpload = (field: string, file: File) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    toast({
      title: "File Uploaded",
      description: `${file.name} uploaded successfully`,
    });
  };

  const handleArrayUpdate = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

  const removeFromArray = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_, i) => i !== index)
    }));
  };

  const submitStep = async () => {
    const stepId = onboardingSteps[currentStep].id;
    
    // Simulate API verification
    setTimeout(() => {
      setVerificationStatus(prev => ({
        ...prev,
        [stepId]: 'approved'
      }));
      
      toast({
        title: "Step Completed",
        description: `${onboardingSteps[currentStep].title} verification successful`,
      });
      
      if (currentStep < onboardingSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }, 2000);

    setVerificationStatus(prev => ({
      ...prev,
      [stepId]: 'processing'
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'processing':
        return <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderStep = () => {
    const step = onboardingSteps[currentStep];
    
    switch (step.id) {
      case 'identity':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-title-large mb-2">Identity Verification</h2>
              <p className="text-body text-gray-600">
                We need to verify your identity to ensure client safety and platform security
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fullLegalName">Full Legal Name</Label>
                <Input
                  id="fullLegalName"
                  value={formData.fullLegalName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullLegalName: e.target.value }))}
                  placeholder="Enter your full legal name as it appears on ID"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="socialInsuranceNumber">Social Insurance Number</Label>
                <Input
                  id="socialInsuranceNumber"
                  value={formData.socialInsuranceNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, socialInsuranceNumber: e.target.value }))}
                  placeholder="XXX-XXX-XXX"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Required for tax reporting and background verification</p>
              </div>

              <div>
                <Label>Government Issued Photo ID</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload driver's license, passport, or provincial ID</p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('governmentId', e.target.files[0])}
                    className="hidden"
                    id="governmentId"
                  />
                  <Label htmlFor="governmentId" className="btn-primary cursor-pointer">
                    Choose File
                  </Label>
                  {formData.governmentId && (
                    <p className="text-sm text-green-600 mt-2">✓ {formData.governmentId.name}</p>
                  )}
                </div>
              </div>

              <div>
                <Label>Selfie with ID</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Take a clear photo holding your ID next to your face</p>
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('selfieWithId', e.target.files[0])}
                    className="hidden"
                    id="selfieWithId"
                  />
                  <Label htmlFor="selfieWithId" className="btn-primary cursor-pointer">
                    Take Photo
                  </Label>
                  {formData.selfieWithId && (
                    <p className="text-sm text-green-600 mt-2">✓ {formData.selfieWithId.name}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'background':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-title-large mb-2">Background Check</h2>
              <p className="text-body text-gray-600">
                Complete background verification to ensure client safety and trust
              </p>
            </div>

            <Card className="ios-card">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="backgroundConsent"
                      checked={formData.backgroundCheckConsent}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, backgroundCheckConsent: checked as boolean }))
                      }
                    />
                    <div>
                      <Label htmlFor="backgroundConsent" className="text-sm font-medium">
                        I consent to a criminal background check
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">
                        VELY will conduct a comprehensive background check including criminal records, 
                        employment verification, and reference checks.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="criminalRecord"
                      checked={formData.criminalRecordCheck}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, criminalRecordCheck: checked as boolean }))
                      }
                    />
                    <div>
                      <Label htmlFor="criminalRecord" className="text-sm font-medium">
                        I authorize criminal record verification
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">
                        This includes local, provincial, and federal criminal record checks.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="references"
                      checked={formData.referencesProvided}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, referencesProvided: checked as boolean }))
                      }
                    />
                    <div>
                      <Label htmlFor="references" className="text-sm font-medium">
                        I will provide professional references
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">
                        At least 2 professional references from previous employers or clients.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Background Check Process</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Background checks typically take 3-5 business days. You'll receive email updates 
                    on the verification status. Your application will be reviewed once all checks are complete.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'professional':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Briefcase className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-title-large mb-2">Professional History</h2>
              <p className="text-body text-gray-600">
                Tell us about your experience and qualifications
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="licenseNumber">Cosmetology License Number</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    placeholder="License #"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="licenseExpiry">License Expiry Date</Label>
                  <Input
                    id="licenseExpiry"
                    type="date"
                    value={formData.licenseExpiry}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenseExpiry: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="yearsOfExperience">Years of Professional Experience</Label>
                <Select
                  value={formData.yearsOfExperience}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, yearsOfExperience: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 years (Student/New Graduate)</SelectItem>
                    <SelectItem value="2-3">2-3 years</SelectItem>
                    <SelectItem value="4-5">4-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="11-15">11-15 years</SelectItem>
                    <SelectItem value="16+">16+ years (Senior Professional)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Previous Salons/Workplaces</Label>
                <div className="mt-2 space-y-2">
                  {formData.previousSalons.map((salon, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Badge variant="secondary" className="flex-1 justify-between">
                        {salon}
                        <button
                          onClick={() => removeFromArray('previousSalons', index)}
                          className="ml-2 text-gray-500 hover:text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add previous workplace"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          handleArrayUpdate('previousSalons', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Specializations</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {specialtyOptions.map((specialty) => (
                    <div key={specialty} className="flex items-center space-x-2">
                      <Checkbox
                        id={specialty}
                        checked={formData.specializations.includes(specialty)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleArrayUpdate('specializations', specialty);
                          } else {
                            const index = formData.specializations.indexOf(specialty);
                            removeFromArray('specializations', index);
                          }
                        }}
                      />
                      <Label htmlFor={specialty} className="text-sm">
                        {specialty}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'bio':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-title-large mb-2">Personal Bio & Story</h2>
              <p className="text-body text-gray-600">
                Share your story to help clients connect with you personally
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="personalBio">Professional Bio</Label>
                <Textarea
                  id="personalBio"
                  value={formData.personalBio}
                  onChange={(e) => setFormData(prev => ({ ...prev, personalBio: e.target.value }))}
                  placeholder="Write a brief professional bio that clients will see on your profile. Include your expertise, approach to styling, and what makes you unique..."
                  className="mt-1 min-h-[100px]"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.personalBio.length}/500 characters</p>
              </div>

              <div>
                <Label htmlFor="workHistory">Work History & Career Journey</Label>
                <Textarea
                  id="workHistory"
                  value={formData.workHistory}
                  onChange={(e) => setFormData(prev => ({ ...prev, workHistory: e.target.value }))}
                  placeholder="Tell us about your career journey. Where did you start? What salons have you worked at? What experiences shaped your styling approach?"
                  className="mt-1 min-h-[80px]"
                  maxLength={400}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.workHistory.length}/400 characters</p>
              </div>

              <div>
                <Label htmlFor="personalStory">Personal Story & Background</Label>
                <Textarea
                  id="personalStory"
                  value={formData.personalStory}
                  onChange={(e) => setFormData(prev => ({ ...prev, personalStory: e.target.value }))}
                  placeholder="Share your personal story. Where did you grow up? What inspired you to become a stylist? What are your roots and cultural background?"
                  className="mt-1 min-h-[80px]"
                  maxLength={400}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.personalStory.length}/400 characters</p>
              </div>

              <div>
                <Label htmlFor="familyBackground">Family & Community</Label>
                <Textarea
                  id="familyBackground"
                  value={formData.familyBackground}
                  onChange={(e) => setFormData(prev => ({ ...prev, familyBackground: e.target.value }))}
                  placeholder="Tell clients about your family, community ties, or cultural heritage that influences your work. This helps clients feel more connected to you."
                  className="mt-1 min-h-[80px]"
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.familyBackground.length}/300 characters</p>
              </div>

              <div>
                <Label htmlFor="hobbies">Hobbies & Interests</Label>
                <Textarea
                  id="hobbies"
                  value={formData.hobbies}
                  onChange={(e) => setFormData(prev => ({ ...prev, hobbies: e.target.value }))}
                  placeholder="What do you enjoy outside of work? Sports, arts, travel, cooking? These personal touches help clients relate to you as a person."
                  className="mt-1 min-h-[60px]"
                  maxLength={250}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.hobbies.length}/250 characters</p>
              </div>

              <div>
                <Label htmlFor="whyBecomeStylist">Why Did You Become a Stylist?</Label>
                <Textarea
                  id="whyBecomeStylist"
                  value={formData.whyBecomeStylist}
                  onChange={(e) => setFormData(prev => ({ ...prev, whyBecomeStylist: e.target.value }))}
                  placeholder="What motivated you to choose this career? What do you love most about making people look and feel their best?"
                  className="mt-1 min-h-[80px]"
                  maxLength={350}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.whyBecomeStylist.length}/350 characters</p>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-800">Why Share Your Story?</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    Personal bios help clients choose stylists they connect with. Sharing your background, 
                    interests, and journey builds trust and helps clients feel comfortable inviting you into their homes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'portfolio':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-title-large mb-2">Portfolio & Documents</h2>
              <p className="text-body text-gray-600">
                Showcase your work and upload required documents
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Professional Certifications</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload certificates, diplomas, training records</p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        Array.from(e.target.files).forEach(file => {
                          setFormData(prev => ({
                            ...prev,
                            certifications: [...prev.certifications, file]
                          }));
                        });
                      }
                    }}
                    className="hidden"
                    id="certifications"
                  />
                  <Label htmlFor="certifications" className="btn-primary cursor-pointer">
                    Upload Certificates
                  </Label>
                  {formData.certifications.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {formData.certifications.map((cert, index) => (
                        <p key={index} className="text-sm text-green-600">✓ {cert.name}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label>Portfolio Photos</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload 5-15 high-quality photos of your work</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        Array.from(e.target.files).forEach(file => {
                          setFormData(prev => ({
                            ...prev,
                            portfolioImages: [...prev.portfolioImages, file]
                          }));
                        });
                      }
                    }}
                    className="hidden"
                    id="portfolio"
                  />
                  <Label htmlFor="portfolio" className="btn-primary cursor-pointer">
                    Upload Photos
                  </Label>
                  {formData.portfolioImages.length > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {formData.portfolioImages.length} photos uploaded
                    </p>
                  )}
                </div>
              </div>

              {/* Language Proficiency Section */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Language Skills
                </Label>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="motherTongue">Mother Tongue / Native Language</Label>
                    <Select
                      value={formData.motherTongue}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, motherTongue: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your native language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="mandarin">Mandarin Chinese</SelectItem>
                        <SelectItem value="cantonese">Cantonese</SelectItem>
                        <SelectItem value="punjabi">Punjabi</SelectItem>
                        <SelectItem value="arabic">Arabic</SelectItem>
                        <SelectItem value="tagalog">Tagalog</SelectItem>
                        <SelectItem value="italian">Italian</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="portuguese">Portuguese</SelectItem>
                        <SelectItem value="polish">Polish</SelectItem>
                        <SelectItem value="russian">Russian</SelectItem>
                        <SelectItem value="korean">Korean</SelectItem>
                        <SelectItem value="japanese">Japanese</SelectItem>
                        <SelectItem value="vietnamese">Vietnamese</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="urdu">Urdu</SelectItem>
                        <SelectItem value="farsi">Farsi/Persian</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Additional Languages</Label>
                    <p className="text-xs text-gray-500 mb-2">Add other languages you can communicate in with clients</p>
                    
                    <div className="space-y-2">
                      {formData.additionalLanguages.map((lang, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 border rounded-lg">
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <Select
                              value={lang.language}
                              onValueChange={(value) => {
                                const updated = [...formData.additionalLanguages];
                                updated[index] = { ...updated[index], language: value };
                                setFormData(prev => ({ ...prev, additionalLanguages: updated }));
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Language" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="french">French</SelectItem>
                                <SelectItem value="spanish">Spanish</SelectItem>
                                <SelectItem value="mandarin">Mandarin Chinese</SelectItem>
                                <SelectItem value="cantonese">Cantonese</SelectItem>
                                <SelectItem value="punjabi">Punjabi</SelectItem>
                                <SelectItem value="arabic">Arabic</SelectItem>
                                <SelectItem value="tagalog">Tagalog</SelectItem>
                                <SelectItem value="italian">Italian</SelectItem>
                                <SelectItem value="german">German</SelectItem>
                                <SelectItem value="portuguese">Portuguese</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Select
                              value={lang.fluency}
                              onValueChange={(value) => {
                                const updated = [...formData.additionalLanguages];
                                updated[index] = { ...updated[index], fluency: value };
                                setFormData(prev => ({ ...prev, additionalLanguages: updated }));
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Fluency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="basic">Basic</SelectItem>
                                <SelectItem value="conversational">Conversational</SelectItem>
                                <SelectItem value="fluent">Fluent</SelectItem>
                                <SelectItem value="native">Native</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updated = formData.additionalLanguages.filter((_, i) => i !== index);
                              setFormData(prev => ({ ...prev, additionalLanguages: updated }));
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            additionalLanguages: [...prev.additionalLanguages, { language: '', fluency: '' }]
                          }));
                        }}
                        className="w-full"
                      >
                        + Add Language
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                    placeholder="Full name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                    placeholder="Phone number"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepComplete = () => {
    const step = onboardingSteps[currentStep];
    switch (step.id) {
      case 'identity':
        return formData.fullLegalName && formData.dateOfBirth && formData.socialInsuranceNumber && 
               formData.governmentId && formData.selfieWithId;
      case 'background':
        return formData.backgroundCheckConsent && formData.criminalRecordCheck && formData.referencesProvided;
      case 'professional':
        return formData.licenseNumber && formData.licenseExpiry && formData.yearsOfExperience && 
               formData.specializations.length > 0;
      case 'bio':
        return formData.personalBio.length >= 50 && formData.workHistory.length >= 30 && 
               formData.personalStory.length >= 30 && formData.whyBecomeStylist.length >= 30;
      case 'portfolio':
        return formData.certifications.length > 0 && formData.portfolioImages.length >= 3 && 
               formData.emergencyContact && formData.emergencyPhone && formData.motherTongue;
      default:
        return false;
    }
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <h1 className="text-headline">Stylist Onboarding</h1>
      </div>

      <div className="app-content">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {onboardingSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < onboardingSteps.length - 1 && (
                  <div className={`w-8 h-0.5 ${
                    index < currentStep ? 'bg-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold">{onboardingSteps[currentStep].title}</h3>
            <p className="text-sm text-gray-600">{onboardingSteps[currentStep].description}</p>
          </div>
        </div>

        {/* Step Content */}
        <Card className="ios-card mb-6">
          <CardContent className="p-6">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Verification Status */}
        <Card className="ios-card mb-6">
          <CardHeader>
            <CardTitle className="text-headline">Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(verificationStatus).map(([key, status]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-body capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(status)}>
                      {status}
                    </Badge>
                    {getStatusIcon(status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          <Button
            onClick={submitStep}
            disabled={!isStepComplete()}
            className="btn-primary"
          >
            {currentStep === onboardingSteps.length - 1 ? 'Complete Onboarding' : 'Next Step'}
          </Button>
        </div>
      </div>
    </div>
  );
}