"use client";

import { templatesApi } from "@/api";
import { WhatsAppTemplates } from "@/components/tables/WhatsAppTemplates";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CreateTemplateRequest, MessageTemplate, UpdateTemplateRequest } from "@/types";
import { Filter, Loader2, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<MessageTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    // Form states
    const [formData, setFormData] = useState<CreateTemplateRequest>({
        name: "",
        platform: "whatsapp",
        category: "marketing"
    });

    const categories = [
        "marketing",
        "utility",
        "authentication",
    ];

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            setLoading(true);
            const response = await templatesApi.getTemplates();
            setTemplates(response.templates || []);
        } catch (error) {
            console.error("Error loading templates:", error);
            alert("Failed to load templates");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTemplate = async () => {
        try {
            setCreateLoading(true);
            await templatesApi.createTemplate(formData).then(() => {
                toast.success("Template created successfully");
                setIsCreateDialogOpen(false);
                setFormData({ name: "", platform: "whatsapp", category: "marketing" });
                loadTemplates();
            });
        } catch (error) {
            console.error("Error creating template:", error);
            alert("Failed to create template");
        } finally {
            setCreateLoading(false);
        }
    };

    const handleUpdateTemplate = async () => {
        if (!editingTemplate) return;

        try {
            const updateData: UpdateTemplateRequest = {
                name: formData.name,
                platform: formData.platform,
                category: formData.category
            };

            await templatesApi.updateTemplate(editingTemplate.id, updateData);
            alert("Template updated successfully");
            setIsEditDialogOpen(false);
            setEditingTemplate(null);
            setFormData({ name: "", platform: "whatsapp", category: "marketing" });
            loadTemplates();
        } catch (error) {
            console.error("Error updating template:", error);
            alert("Failed to update template");
        }
    };


    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || template.platformMetadata.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading templates...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full">
            {/* Page Header */}
            <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Message Templates</h1>
                        <p className="text-sm text-muted-foreground">
                            Create and manage reusable message templates
                        </p>
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                New Template
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Create New Template</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <div className="flex flex-col gap-2 flex-1">
                                        <Label htmlFor="name">Template Name</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Enter template name"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleCreateTemplate} disabled={createLoading}>
                                        {createLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            : "Create Template"}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>


            {/* Filters */}
            <div className="p-4 border-b bg-muted/50">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search templates..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Templates List */}
            <div className="flex-1 overflow-y-auto p-4">
                {filteredTemplates.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No templates found</p>
                        {searchTerm || selectedCategory !== "all" ? (
                            <Button variant="outline" className="mt-2" onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory("all");
                            }}>
                                Clear filters
                            </Button>
                        ) : (
                            <Button className="mt-2" onClick={() => setIsCreateDialogOpen(true)}>
                                Create your first template
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-4">
                        <WhatsAppTemplates templates={filteredTemplates} />

                    </div>
                )}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Template</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-name">Template Name</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter template name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-category">Category</Label>
                            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="edit-content">Template Content</Label>
                            <Textarea
                                id="edit-content"
                                value={formData.platform}
                                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                placeholder="Enter your message template..."
                                rows={4}
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleUpdateTemplate}>
                                Update Template
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
} 