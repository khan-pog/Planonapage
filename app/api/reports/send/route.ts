import { NextResponse } from 'next/server';
import { getAllProjects } from '@/lib/db';

// In a real implementation, you would use a service like Resend, SendGrid, or Nodemailer
// For now, this simulates the email sending process

export async function POST(request: Request) {
  try {
    const { emailList, reportSettings } = await request.json();
    
    // Get all projects for the report
    const projects = await getAllProjects();
    
    // Generate report content
    const totalProjects = projects.length;
    const underBudget = projects.filter((p: any) => p.costTracking?.costStatus === "Under Budget").length;
    const onTrackCost = projects.filter((p: any) => p.costTracking?.costStatus === "On Track").length;
    const monitorCost = projects.filter((p: any) => p.costTracking?.costStatus === "Monitor").length;
    const overBudget = projects.filter((p: any) => p.costTracking?.costStatus === "Over Budget").length;
    
    const projectsNeedingAttention = projects.filter((p: any) => 
      p.costTracking?.costStatus && 
      p.costTracking.costStatus !== "On Track" && 
      p.costTracking.costStatus !== "Under Budget"
    );

    // In a real implementation, you would format and send the email here
    // For example, using Resend:
    // 
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // 
    // const emailContent = `
    //   <h1>Weekly Project Report</h1>
    //   <h2>Summary</h2>
    //   <p>Total Projects: ${totalProjects}</p>
    //   <p>Under Budget: ${underBudget}</p>
    //   <p>On Track: ${onTrackCost}</p>
    //   <p>Monitor: ${monitorCost}</p>
    //   <p>Over Budget: ${overBudget}</p>
    //   
    //   <h2>Projects Requiring Attention</h2>
    //   ${projectsNeedingAttention.map(p => `
    //     <div>
    //       <strong>${p.title}</strong> (${p.number}) - ${p.costTracking?.costStatus}
    //       <br>PM: ${p.projectManager}
    //     </div>
    //   `).join('')}
    // `;
    // 
    // for (const email of emailList) {
    //   await resend.emails.send({
    //     from: 'reports@yourcompany.com',
    //     to: email,
    //     subject: `Weekly Project Cost Report - ${new Date().toLocaleDateString()}`,
    //     html: emailContent,
    //   });
    // }

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Report sent to emails:', emailList);
    console.log('Report summary:', {
      totalProjects,
      underBudget,
      onTrackCost,
      monitorCost,
      overBudget,
      projectsNeedingAttention: projectsNeedingAttention.length
    });

    return NextResponse.json({ 
      success: true, 
      message: `Report sent to ${emailList.length} recipients`,
      summary: {
        totalProjects,
        underBudget,
        onTrackCost,
        monitorCost,
        overBudget,
        projectsNeedingAttention: projectsNeedingAttention.length
      }
    });
  } catch (error) {
    console.error('Error sending report:', error);
    return new NextResponse('Failed to send report', { status: 500 });
  }
}