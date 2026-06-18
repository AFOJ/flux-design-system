import type { Meta, StoryObj } from "@storybook/preact";
import Label from "./Label";
import Input from "../input";

const meta = {
  title: "Components/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "The content to display inside the label",
      table: {
        type: { summary: "ReactNode" },
        defaultValue: { summary: "Label Text" },
      },
    },
    class: {
      control: "text",
      description: "Additional CSS classes to apply to the label",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    htmlFor: {
      control: "text",
      description: "ID of the form element this label is associated with",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Default Label",
    htmlFor: "default-input",
  },
};

export const WithInput: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <Label {...args} htmlFor="email-input">
        Email Address
      </Label>
      <Input
        id="email-input"
        type="email"
        placeholder="Enter your email"
        fill
      />
    </div>
  ),
  args: {
    children: "Email Address",
  }
};

export const DifferentInputStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: "300px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <Label htmlFor="default-input">Default Input</Label>
        <Input
          id="default-input"
          type="text"
          placeholder="Type something..."
          fill
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <Label htmlFor="error-input">Error State</Label>
        <Input
          id="error-input"
          type="text"
          placeholder="This has an error"
          error
          fill
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <Label htmlFor="success-input">Success State</Label>
        <Input
          id="success-input"
          type="text"
          placeholder="This is valid"
          success
          fill
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <Label htmlFor="disabled-input">Disabled Input</Label>
        <Input
          id="disabled-input"
          type="text"
          placeholder="This is disabled"
          disabled
          fill
        />
      </div>
    </div>
  ),
};


// Custom Styling
export const CustomStyling: Story = {
  args: {
    children: "Custom Styled Label",
    class: "font-bold text-3xl",
    htmlFor: "custom-input",
  },
  decorators: [
    (Story) => (
      <div style={{ minWidth: "300px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Story />
          <Input
            id="custom-input"
            type="text"
            placeholder="Custom styled input"
            fill
          />
        </div>
      </div>
    ),
  ],
};
