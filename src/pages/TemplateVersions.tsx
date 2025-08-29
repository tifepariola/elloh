"use client";

import { templatesApi } from "@/api";
import { TemplateVersions } from "@/components/tables/TemplateVersions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TemplateVersion, TemplateVersionsResponse } from "@/types";
import { ArrowLeft, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function TemplateVersionsPage() {
    const { templateId } = useParams<{ templateId: string }>();
    const navigate = useNavigate();
    const [versions, setVersions] = useState<TemplateVersion[]>([]);
    const [loading, setLoading] = useState(true);
    const [templateName, setTemplateName] = useState<string>("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingVersion, setEditingVersion] = useState<TemplateVersion | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // Form states for creating/editing versions
    const [formData, setFormData] = useState({
        description: "",
        headerText: "",
        bodyText: "",
        locale: "en"
    });

    const locales = [
        { code: "en", name: "English" },
        { code: "es", name: "Spanish" },
        { code: "fr", name: "French" },
        { code: "de", name: "German" },
        { code: "pt", name: "Portuguese" },
        { code: "it", name: "Italian" },
        { code: "nl", name: "Dutch" },
        { code: "ar", name: "Arabic" },
        { code: "hi", name: "Hindi" },
        { code: "ja", name: "Japanese" },
        { code: "ko", name: "Korean" },
        { code: "zh", name: "Chinese" }
    ];

    useEffect(() => {
        if (templateId) {
            loadVersions();
        }
    }, [templateId]);

    const loadVersions = async () => {
        if (!templateId) return;
        
        try {
            setLoading(true);
            const response: TemplateVersionsResponse = await templatesApi.getTemplateVersions(templateId);
            setVersions(response.versions || []);
            
            // Try to get template name from the first version
            if (response.versions && response.versions.length > 0) {
                // You might want to fetch the template details separately
                setTemplateName(`Template ${templateId.slice(0, 8)}...`);
            }
        } catch (error) {
            console.error("Error loading template versions:", error);
            alert("Failed to load template versions");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateVersion = async () => {
        if (!templateId) return;

        try {
            const versionData = {
                content: {
                    locale: formData.locale,
                    blocks: [
                        {
                            type: "text",
                            role: "body",
                            text: formData.bodyText
                        },
                        ...(formData.headerText ? [{
                            type: "text",
                            role: "header",
                            text: formData.headerText
                        }] : [])
                    ],
                    channelID: "90af067d-0061-49f8-85bb-03ba01561c88" // This should be set based on your channel
                },
            };

            await templatesApi.createTemplateVersion(templateId, versionData);
            toast.success("Version created successfully");
            setIsCreateDialogOpen(false);
            setFormData({ description: "", headerText: "", bodyText: "", locale: "en" });
            loadVersions();
        } catch (error) {
            console.error("Error creating version:", error);
            toast.error("Failed to create version");
        }
    };

    const handleUpdateVersion = async () => {
        if (!templateId || !editingVersion) return;

        try {
            const versionData = {
                content: {
                    locale: formData.locale,
                    blocks: [
                        {
                            type: "text",
                            role: "body",
                            text: formData.bodyText
                        },
                        ...(formData.headerText ? [{
                            type: "text",
                            role: "header",
                            text: formData.headerText
                        }] : [])
                    ],
                    channelID: editingVersion.content.channelID
                },
                description: formData.description
            };

            await templatesApi.updateTemplateVersion(templateId, editingVersion.id, versionData);
            toast.success("Version updated successfully");
            setIsEditDialogOpen(false);
            setEditingVersion(null);
            setFormData({ description: "", headerText: "", bodyText: "", locale: "en" });
            loadVersions();
        } catch (error) {
            console.error("Error updating version:", error);
            toast.error("Failed to update version");
        }
    };

    const handleDeleteVersion = async (versionId: string) => {
        if (!templateId) return;

        if (!confirm("Are you sure you want to delete this version?")) return;

        try {
            await templatesApi.deleteTemplateVersion(templateId, versionId);
            alert("Version deleted successfully");
            loadVersions();
        } catch (error) {
            console.error("Error deleting version:", error);
            alert("Failed to delete version");
        }
    };

    const handleCopyVersion = (version: TemplateVersion) => {
        const content = version.content.blocks
            .map(block => `${block.role}: ${block.text}`)
            .join('\n');
        navigator.clipboard.writeText(content);
        alert("Version content copied to clipboard");
    };

    const openEditDialog = (version: TemplateVersion) => {
        setEditingVersion(version);
        const headerBlock = version.content.blocks.find(block => block.role === "header");
        const bodyBlock = version.content.blocks.find(block => block.role === "body");
        
        setFormData({
            description: version.description,
            headerText: headerBlock?.text || "",
            bodyText: bodyBlock?.text || "",
            locale: version.content.locale
        });
        setIsEditDialogOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading template versions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full">
            {/* Page Header */}
            <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("/templates")}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Templates
                        </Button>
                        <div>
                            <h1 className="text-xl font-semibold">Template Versions</h1>
                            <p className="text-sm text-muted-foreground">
                                {templateName} • {versions.length} version{versions.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                New Version
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Create New Version</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="locale">Language</Label>
                                    <Select value={formData.locale} onValueChange={(value) => setFormData({ ...formData, locale: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {locales.map((locale) => (
                                                <SelectItem key={locale.code} value={locale.code}>
                                                    {locale.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="header">Header Text (Optional)</Label>
                                    <Input
                                        id="header"
                                        value={formData.headerText}
                                        onChange={(e) => setFormData({ ...formData, headerText: e.target.value })}
                                        placeholder="Enter header text..."
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="body">Body Text</Label>
                                    <Textarea
                                        id="body"
                                        value={formData.bodyText}
                                        onChange={(e) => setFormData({ ...formData, bodyText: e.target.value })}
                                        placeholder="Enter body text..."
                                        rows={4}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Input
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Enter description..."
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleCreateVersion}>
                                        Create Version
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Versions Summary */}
            <div className="p-4 border-b bg-muted/50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Versions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{versions.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Live Versions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {versions.filter(v => v.status === "live").length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Draft Versions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {versions.filter(v => v.status === "draft").length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Languages</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">
                                {new Set(versions.map(v => v.content.locale)).size}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Versions Table */}
            <div className="flex-1 overflow-y-auto p-4">
                {versions.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No versions found for this template</p>
                        <Button className="mt-2" onClick={() => setIsCreateDialogOpen(true)}>
                            Create your first version
                        </Button>
                    </div>
                ) : (
                    <TemplateVersions
                        versions={versions}
                        onEditVersion={openEditDialog}
                        onDeleteVersion={handleDeleteVersion}
                        onCopyVersion={handleCopyVersion}
                    />
                )}
            </div>

            {/* Edit Version Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Version</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-locale">Language</Label>
                            <Select value={formData.locale} onValueChange={(value) => setFormData({ ...formData, locale: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {locales.map((locale) => (
                                        <SelectItem key={locale.code} value={locale.code}>
                                            {locale.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="edit-header">Header Text (Optional)</Label>
                            <Input
                                id="edit-header"
                                value={formData.headerText}
                                onChange={(e) => setFormData({ ...formData, headerText: e.target.value })}
                                placeholder="Enter header text..."
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-body">Body Text</Label>
                            <Textarea
                                id="edit-body"
                                value={formData.bodyText}
                                onChange={(e) => setFormData({ ...formData, bodyText: e.target.value })}
                                placeholder="Enter body text..."
                                rows={4}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-description">Description (Optional)</Label>
                            <Input
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter description..."
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleUpdateVersion}>
                                Update Version
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
} 